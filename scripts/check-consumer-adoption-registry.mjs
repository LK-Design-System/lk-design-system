import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const DEFAULT_EXPECTED_REPOSITORIES = {
  portal: 'LK-ROBOTICS-AX/lk_portal',
  'web-viz': 'LK-ROBOTICS/lk_web_viz',
};
const CONSUMER_ROOTS = {
  portal: ['ops', 'lk-portal'],
  'web-viz': ['ops', 'lk_web_viz', 'frontend'],
};
const LDS_PACKAGE_NAMES = [
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
];
const STAGE_CHECKS = {
  wired: ['install', 'sourceContract'],
  'build-verified': ['install', 'sourceContract', 'productionBuild'],
  'workflow-verified': [
    'install',
    'sourceContract',
    'productionBuild',
    'workflowSmoke',
    'accessibility',
  ],
};
const ATTESTATION_CHECK_IDS = {
  install: ['install'],
  sourceContract: ['source-contract'],
  productionBuild: ['production-build'],
  workflowSmoke: ['workflow-smoke', 'production-smoke'],
  accessibility: ['accessibility'],
};

function fail(message) {
  throw new Error(`Consumer adoption registry failed: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${label} is not valid JSON (${error.message})`);
  }
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function formatValidationErrors(errors) {
  return (errors || [])
    .map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ');
}

function compile(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

function releaseChannel(version) {
  return version.includes('-rc.') ? 'release-candidate' : 'stable';
}

function validDateTimestamp(value, label) {
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  assert(Number.isFinite(timestamp), `${label} must be a valid date`);
  return timestamp;
}

function assertValidDateNotAfterRegistry(value, registryDate, label) {
  const evidenceTimestamp = validDateTimestamp(value, label);
  const registryTimestamp = validDateTimestamp(registryDate, 'registry generatedAt');
  assert(
    evidenceTimestamp <= registryTimestamp,
    `${label} ${value} must not be later than registry generatedAt ${registryDate}`,
  );
}

function assertDateNotBefore(value, prerequisite, label, prerequisiteLabel) {
  assert(
    validDateTimestamp(value, label) >= validDateTimestamp(prerequisite, prerequisiteLabel),
    `${label} ${value} must not be earlier than ${prerequisiteLabel} ${prerequisite}`,
  );
}

function resolveInjectedAttestation(attestations, entry) {
  if (!attestations) return null;
  if (attestations instanceof Map) return attestations.get(entry.attestation) ?? null;
  return attestations[entry.attestation] ?? null;
}

function assertEvidenceFiles(workspaceRoot, paths, label) {
  for (const evidencePath of paths || []) {
    assert(
      existsSync(path.join(workspaceRoot, ...evidencePath.split('/'))),
      `${label} evidence is missing: ${evidencePath}`,
    );
  }
}

function assertRepositoryFile(rootDir, relativePath, label) {
  assert(!path.isAbsolute(relativePath), `${label} must be relative to the LDS repository`);
  const resolvedRoot = path.resolve(rootDir);
  const resolvedPath = path.resolve(resolvedRoot, relativePath);
  const relativeToRoot = path.relative(resolvedRoot, resolvedPath);
  assert(
    relativeToRoot !== ''
      && !relativeToRoot.startsWith(`..${path.sep}`)
      && relativeToRoot !== '..'
      && !path.isAbsolute(relativeToRoot),
    `${label} must stay inside the LDS repository: ${relativePath}`,
  );
  assert(existsSync(resolvedPath), `${label} is missing: ${relativePath}`);
  assert(statSync(resolvedPath).isFile(), `${label} must be a regular file: ${relativePath}`);
}

function assertRepositoryFiles(rootDir, relativePaths, label) {
  for (const relativePath of relativePaths || []) {
    assertRepositoryFile(rootDir, relativePath, `${label} evidence`);
  }
}

/**
 * Validate the registry's three independent decisions:
 * package release channel, consumer adoption stage, and product deployment.
 * Tests may inject registry/attestation objects; the CLI reads canonical files.
 */
export function validateConsumerAdoptionRegistry({
  rootDir = process.cwd(),
  workspaceRoot = null,
  registry: injectedRegistry = null,
  schema: injectedSchema = null,
  attestationSchema: injectedAttestationSchema = null,
  attestations = null,
  expectedRepositories = DEFAULT_EXPECTED_REPOSITORIES,
} = {}) {
  const adoptionRoot = path.join(rootDir, 'docs/references/adoption');
  const registryPath = path.join(adoptionRoot, 'LDS_CONSUMER_REGISTRY.json');
  const schemaPath = path.join(adoptionRoot, 'LDS_CONSUMER_REGISTRY.schema.json');
  const attestationSchemaPath = path.join(adoptionRoot, 'LDS_CONSUMER_ATTESTATION.schema.json');
  const registry = injectedRegistry ?? readJson(registryPath, 'LDS_CONSUMER_REGISTRY.json');
  const schema = injectedSchema ?? readJson(schemaPath, 'LDS_CONSUMER_REGISTRY.schema.json');
  const attestationSchema = injectedAttestationSchema
    ?? readJson(attestationSchemaPath, 'LDS_CONSUMER_ATTESTATION.schema.json');

  const validateRegistry = compile(schema);
  assert(validateRegistry(registry), formatValidationErrors(validateRegistry.errors));

  const inferredReleaseChannel = releaseChannel(registry.ldsVersion);
  assert(
    registry.packageRelease.channel === inferredReleaseChannel,
    `packageRelease.channel ${registry.packageRelease.channel} does not match ${registry.ldsVersion}`,
  );
  if (registry.packageRelease.availability === 'verified') {
    assert(
      registry.packageRelease.releaseTag === `lds-v${registry.ldsVersion}`,
      `verified package release tag must be lds-v${registry.ldsVersion}`,
    );
    assert(registry.packageRelease.evidence?.length > 0, 'verified package release needs evidence');
    assertRepositoryFiles(rootDir, registry.packageRelease.evidence, 'verified package release');
  }
  if (inferredReleaseChannel === 'stable') {
    assert(registry.packageRelease.availability === 'verified', 'stable package availability must be verified');
    assert(registry.packageRelease.supportPolicy, 'stable package release needs a supportPolicy');
    assert(registry.packageRelease.rollbackArtifact, 'stable package release needs a rollbackArtifact');
    assertRepositoryFile(rootDir, registry.packageRelease.supportPolicy, 'stable supportPolicy');
    assertRepositoryFile(rootDir, registry.packageRelease.rollbackArtifact, 'stable rollbackArtifact');
  }

  const expectedIds = new Set(Object.keys(expectedRepositories));
  assert(
    registry.entries.length === expectedIds.size,
    `registry must contain exactly ${[...expectedIds].join(' and ')} entries`,
  );

  const validateAttestation = compile(attestationSchema);
  const ids = new Set();
  let packagePins = 0;
  let workflowVerified = 0;
  let deployed = 0;

  for (const entry of registry.entries) {
    assert(!ids.has(entry.id), `duplicate consumer id ${entry.id}`);
    ids.add(entry.id);
    assert(expectedIds.has(entry.id), `unexpected consumer id ${entry.id}`);
    assert(entry.repository === expectedRepositories[entry.id], `${entry.id} repository identity drifted`);
    assert(
      entry.evidenceFreshness === 'current',
      `${entry.id} ${entry.stage} evidence must be current${entry.staleReason ? ` (${entry.staleReason})` : ''}`,
    );

    const requiredChecks = STAGE_CHECKS[entry.stage];
    assert(requiredChecks, `${entry.id} has unknown stage ${entry.stage}`);
    for (const checkName of requiredChecks) {
      assert(
        entry.checks[checkName]?.status === 'passed',
        `${entry.id} cannot claim ${entry.stage}: ${checkName} is not passed`,
      );
    }
    assert(
      entry.evidence.length >= requiredChecks.length,
      `${entry.id} ${entry.stage} needs at least ${requiredChecks.length} evidence references`,
    );

    const packageNames = new Set();
    for (const item of entry.packages) {
      assert(!packageNames.has(item.name), `${entry.id} duplicates package pin ${item.name}`);
      packageNames.add(item.name);
    }
    for (const packageName of LDS_PACKAGE_NAMES) {
      const count = entry.packages.filter((item) => item.name === packageName).length;
      assert(count === 1, `${entry.id} must pin exactly one ${packageName} (found ${count})`);
    }
    for (const item of entry.packages) {
      packagePins += 1;
      assert(
        path.basename(item.artifactPath).includes(`-${item.version}.tgz`),
        `${entry.id} ${item.name} artifact path must include package version ${item.version}`,
      );
      if (LDS_PACKAGE_NAMES.includes(item.name)) {
        assert(item.version === registry.ldsVersion, `${entry.id} ${item.name} must match registry ldsVersion`);
      }
    }

    const attestationPath = path.join(adoptionRoot, entry.attestation);
    const attestation = resolveInjectedAttestation(attestations, entry)
      ?? (() => {
        assert(existsSync(attestationPath), `${entry.id} attestation is missing: ${entry.attestation}`);
        return readJson(attestationPath, `${entry.id} attestation`);
      })();
    assert(
      validateAttestation(attestation),
      `${entry.id} attestation schema: ${formatValidationErrors(validateAttestation.errors)}`,
    );
    assert(attestation.consumerId === entry.id, `${entry.id} attestation consumerId drifted`);
    assert(attestation.profile === entry.profile, `${entry.id} attestation profile drifted`);
    assertValidDateNotAfterRegistry(
      attestation.generatedAt,
      registry.generatedAt,
      `${entry.id} attestation generatedAt`,
    );

    const attestationChecks = new Map();
    for (const check of attestation.checks) {
      assert(!attestationChecks.has(check.id), `${entry.id} attestation duplicates check ${check.id}`);
      attestationChecks.set(check.id, check);
    }
    for (const checkName of requiredChecks) {
      const aliases = ATTESTATION_CHECK_IDS[checkName];
      assert(
        aliases.some((id) => attestationChecks.get(id)?.status === 'passed'),
        `${entry.id} attestation needs passed ${aliases.join(' or ')} evidence for ${entry.stage}`,
      );
    }

    if (entry.stage === 'workflow-verified') {
      workflowVerified += 1;
      assert(
        entry.cleanReproducibility?.sourceCommit === entry.sourceCommit,
        `${entry.id} clean reproducibility must pin sourceCommit ${entry.sourceCommit}`,
      );
      assertValidDateNotAfterRegistry(
        entry.cleanReproducibility.verifiedAt,
        registry.generatedAt,
        `${entry.id} clean reproducibility verifiedAt`,
      );
      assertValidDateNotAfterRegistry(
        entry.productOwnerApproval.approvedAt,
        registry.generatedAt,
        `${entry.id} product-owner approval approvedAt`,
      );
      assertDateNotBefore(
        entry.productOwnerApproval.approvedAt,
        attestation.generatedAt,
        `${entry.id} product-owner approval approvedAt`,
        'attestation generatedAt',
      );
      assertDateNotBefore(
        entry.productOwnerApproval.approvedAt,
        entry.cleanReproducibility.verifiedAt,
        `${entry.id} product-owner approval approvedAt`,
        'clean reproducibility verifiedAt',
      );
      assert(
        attestation.sourceCommit === entry.sourceCommit,
        `${entry.id} workflow attestation must pin sourceCommit ${entry.sourceCommit}`,
      );
    }

    if (entry.deployment.status !== 'not-attested') {
      assertValidDateNotAfterRegistry(
        entry.deployment.verifiedAt,
        registry.generatedAt,
        `${entry.id} deployment verifiedAt`,
      );
    }
    if (entry.deployment.status === 'deployed') deployed += 1;
    assert(entry.legacyActiveReferences === 0, `${entry.id} still has active legacy references`);

    if (workspaceRoot) {
      const consumerRootParts = CONSUMER_ROOTS[entry.id];
      assert(consumerRootParts, `${entry.id} has no workspace root mapping`);
      const consumerRoot = path.join(workspaceRoot, ...consumerRootParts);
      const packageJsonPath = path.join(consumerRoot, 'package.json');
      assert(
        existsSync(packageJsonPath),
        `${entry.id} package.json is missing at ${path.relative(workspaceRoot, packageJsonPath)}`,
      );
      const packageJson = readJson(packageJsonPath, `${entry.id} package.json`);
      const dependencies = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
      for (const item of entry.packages) {
        assert(
          dependencies[item.name] === `file:${item.artifactPath.split('/').slice(entry.id === 'portal' ? 2 : 3).join('/')}`
            || dependencies[item.name]?.endsWith(`/${path.basename(item.artifactPath)}`),
          `${entry.id} dependency ${item.name} does not point at ${path.basename(item.artifactPath)}`,
        );
        const artifactPath = path.join(workspaceRoot, ...item.artifactPath.split('/'));
        assert(existsSync(artifactPath), `${entry.id} artifact is missing: ${item.artifactPath}`);
        assert(sha256(artifactPath) === item.sha256, `${entry.id} artifact checksum drifted: ${item.artifactPath}`);
      }

      assertEvidenceFiles(workspaceRoot, entry.evidence, entry.id);
      assertEvidenceFiles(workspaceRoot, attestation.evidence, `${entry.id} attestation`);
      if (entry.stage === 'workflow-verified') {
        assertEvidenceFiles(
          workspaceRoot,
          entry.cleanReproducibility.evidence,
          `${entry.id} clean reproducibility`,
        );
        assertEvidenceFiles(
          workspaceRoot,
          entry.productOwnerApproval.evidence,
          `${entry.id} product-owner approval`,
        );
      }
      if (entry.deployment.status !== 'not-attested') {
        assertEvidenceFiles(workspaceRoot, entry.deployment.evidence, `${entry.id} deployment`);
      }

      const sourceFiles = entry.id === 'portal'
        ? ['src/app/layout.tsx', 'src/components/layout/LdsRuntimeBoundary.tsx', 'src/app/globals.css']
        : ['index.html', 'src/contexts/ThemeContext.tsx', 'src/index.css', 'src/screens/LdsOrganizationScreen.tsx'];
      const source = sourceFiles
        .map((relative) => readFileSync(path.join(consumerRoot, relative), 'utf8'))
        .join('\n');
      assert(
        source.includes(`data-lds-profile="${entry.profile}"`)
          || source.includes(`defaultProfile="${entry.profile}"`),
        `${entry.id} source does not activate profile ${entry.profile}`,
      );
      assert(source.includes('@lk-design-system/lds-core/styles.css'), `${entry.id} is missing Core styles`);
      assert(source.includes('@lk-design-system/lds-theme/styles.css'), `${entry.id} is missing Theme styles`);
      assert(source.includes('@lk-design-system/lds-product/styles.css'), `${entry.id} is missing Product styles`);
      assert(!source.includes('@lk-design-system/lds-editorial-ui'), `${entry.id} has an active retired Editorial reference`);
      assert(!source.includes('@design-system/core'), `${entry.id} has an active aggregate design-system reference`);
    }
  }

  return {
    consumers: registry.entries.length,
    packagePins,
    packageReleaseChannel: inferredReleaseChannel,
    packageAvailability: registry.packageRelease.availability,
    workflowVerified,
    deployed,
    workspaceChecked: Boolean(workspaceRoot),
  };
}

function runCli() {
  const workspaceArg = process.argv.find((argument) => argument.startsWith('--workspace-root='));
  const workspaceRoot = workspaceArg
    ? path.resolve(workspaceArg.slice('--workspace-root='.length))
    : null;
  const result = validateConsumerAdoptionRegistry({ rootDir: process.cwd(), workspaceRoot });
  console.log(
    `Validated LDS consumer registry: ${result.consumers} consumers, ${result.packagePins} package pins; `
      + `package=${result.packageReleaseChannel}/${result.packageAvailability}, `
      + `workflow-verified=${result.workflowVerified}, deployed=${result.deployed}`
      + `${result.workspaceChecked ? ' with workspace checks' : ''}.`,
  );
}

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) runCli();
