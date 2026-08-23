import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateConsumerAdoptionRegistry } from './check-consumer-adoption-registry.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adoptionRoot = path.join(rootDir, 'docs/references/adoption');
const ldsPackageNames = new Set([
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
]);
const stableVersion = '0.1.0';
const stableTag = `lds-v${stableVersion}`;
const stableEvidenceRelativePath = 'docs/references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json';
const stableSupportPolicyRelativePath = 'docs/STABLE_SUPPORT_POLICY.md';
const stableSupportMatrixRelativePath = 'docs/STABLE_SUPPORT_MATRIX.md';
const stableRollbackRelativePath = 'docs/STABLE_0.1.0_ROLLBACK.md';
const temporaryRoots = new Set();
const workflowChecks = {
  install: { attestationIds: ['install'], command: 'npm.cmd ci --ignore-scripts' },
  sourceContract: { attestationIds: ['source-contract'], command: 'npm.cmd run check:source-contract' },
  productionBuild: { attestationIds: ['production-build'], command: 'npm.cmd run build' },
  workflowSmoke: {
    attestationIds: ['workflow-smoke', 'production-smoke'],
    command: 'npm.cmd run test:workflow',
  },
  accessibility: {
    attestationIds: ['accessibility'],
    command: 'npm.cmd run test:a11y -- --portal-workflow',
  },
};

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(adoptionRoot, relativePath), 'utf8'));
}

const registrySchema = readJson('LDS_CONSUMER_REGISTRY.schema.json');
const attestationSchema = readJson('LDS_CONSUMER_ATTESTATION.schema.json');
const stableReleaseEvidenceSchema = readJson(
  'releases/LDS_STABLE_RELEASE_EVIDENCE.schema.json',
);

after(() => {
  for (const temporaryRoot of temporaryRoots) {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

function stablePackageSet(version = stableVersion) {
  return [...ldsPackageNames].map((name) => ({ name, version }));
}

function stableContractIdentity(contract, overrides = {}) {
  return {
    schemaVersion: 1,
    kind: 'lds-stable-contract-identity',
    contract,
    status: 'published-verified',
    ldsVersion: stableVersion,
    releaseTag: stableTag,
    packages: stablePackageSet(),
    ...overrides,
  };
}

function writeStableContract(filePath, identity) {
  writeFileSync(
    filePath,
    `# Stable fixture\n\n<!-- lds-stable-identity:start\n${JSON.stringify(identity, null, 2)}\nlds-stable-identity:end -->\n`,
    'utf8',
  );
}

function stableReleaseEvidence(overrides = {}) {
  const sourceCommit = 'b'.repeat(40);
  return {
    $schema: './LDS_STABLE_RELEASE_EVIDENCE.schema.json',
    schemaVersion: 1,
    kind: 'lds-stable-package-release-evidence',
    generatedAt: '2026-08-22',
    release: {
      channel: 'stable',
      version: stableVersion,
      tag: stableTag,
      sourceCommit,
      repository: 'LK-Design-System/lk-design-system',
    },
    immutableTagVerification: {
      status: 'passed',
      command: `git ls-remote --tags origin refs/tags/${stableTag}`,
      resolvedCommit: sourceCommit,
    },
    automation: [{
      workflow: 'Release immutable package set',
      runId: 123456789,
      status: 'passed',
      url: 'https://github.com/LK-Design-System/lk-design-system/actions/runs/123456789',
    }],
    packages: [...ldsPackageNames].map((name, index) => ({
      name,
      version: stableVersion,
      publishedAt: '2026-08-22T12:00:00Z',
      distShasum: String.fromCharCode(97 + index).repeat(40),
      distIntegrity: 'sha512-QUJDRA==',
    })),
    availabilityVerification: {
      status: 'passed',
      command: `npm view @lk-design-system/<package>@${stableVersion} version dist.shasum dist.integrity`,
      registry: 'https://npm.pkg.github.com',
    },
    contracts: {
      supportPolicy: stableSupportPolicyRelativePath,
      supportMatrix: stableSupportMatrixRelativePath,
      rollbackArtifact: stableRollbackRelativePath,
    },
    ...overrides,
  };
}

function createStableRepository() {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'lds-stable-contract-'));
  temporaryRoots.add(temporaryRoot);
  const resolve = (relativePath) => path.join(temporaryRoot, ...relativePath.split('/'));
  mkdirSync(resolve('docs/references/adoption/releases'), { recursive: true });

  writeStableContract(
    resolve(stableSupportPolicyRelativePath),
    stableContractIdentity('support-policy', {
      supportMatrix: stableSupportMatrixRelativePath,
    }),
  );
  writeStableContract(
    resolve(stableSupportMatrixRelativePath),
    stableContractIdentity('support-matrix'),
  );
  writeStableContract(
    resolve(stableRollbackRelativePath),
    stableContractIdentity('rollback', {
      fallbackVersion: '0.1.0-rc.69.30',
      fallbackTag: 'lds-v0.1.0-rc.69.30',
    }),
  );
  writeFileSync(
    resolve(stableEvidenceRelativePath),
    `${JSON.stringify(stableReleaseEvidence(), null, 2)}\n`,
    'utf8',
  );

  return {
    rootDir: temporaryRoot,
    resolve,
    files: {
      supportPolicy: resolve(stableSupportPolicyRelativePath),
      supportMatrix: resolve(stableSupportMatrixRelativePath),
      rollbackArtifact: resolve(stableRollbackRelativePath),
      releaseEvidence: resolve(stableEvidenceRelativePath),
    },
  };
}

function readFixtureJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeFixtureJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function currentFixture() {
  const registry = readJson('LDS_CONSUMER_REGISTRY.json');
  const attestations = Object.fromEntries(
    registry.entries.map((entry) => [entry.attestation, readJson(entry.attestation)]),
  );
  return { registry, attestations };
}

function consumerEntry(fixture, id = 'portal') {
  const entry = fixture.registry.entries.find((item) => item.id === id);
  assert.ok(entry, `fixture must contain ${id}`);
  return entry;
}

function attestationFor(fixture, entry) {
  const attestation = fixture.attestations[entry.attestation];
  assert.ok(attestation, `fixture must contain ${entry.attestation}`);
  return attestation;
}

function registryCounts(fixture) {
  return {
    workflowVerified: fixture.registry.entries.filter(
      (entry) => entry.stage === 'workflow-verified',
    ).length,
    deployed: fixture.registry.entries.filter(
      (entry) => entry.deployment.status === 'deployed',
    ).length,
  };
}

function shiftDate(date, days) {
  const shifted = new Date(`${date}T00:00:00Z`);
  assert.ok(Number.isFinite(shifted.getTime()), `fixture date must be valid: ${date}`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function passAttestationCheck(attestation, ids, command) {
  const existing = attestation.checks.find((check) => ids.includes(check.id));
  if (existing) {
    Object.assign(existing, { status: 'passed', command: existing.command || command });
    return;
  }
  attestation.checks.push({ id: ids[0], status: 'passed', command });
}

function workflowFixture() {
  const fixture = currentFixture();
  const entry = consumerEntry(fixture);
  entry.stage = 'workflow-verified';
  entry.evidenceFreshness = 'current';
  delete entry.staleReason;
  for (const [checkName, { command }] of Object.entries(workflowChecks)) {
    entry.checks[checkName] = {
      ...entry.checks[checkName],
      status: 'passed',
      command: entry.checks[checkName]?.command || command,
    };
  }
  entry.cleanReproducibility = {
    status: 'passed',
    mode: 'clean-clone',
    sourceCommit: entry.sourceCommit,
    verifiedAt: fixture.registry.generatedAt,
    command: 'git clone + npm.cmd ci + npm.cmd run build + npm.cmd run test:workflow',
    evidence: ['ops/lk-portal/visual-artifacts/adoption/clean-clone.json'],
  };
  entry.productOwnerApproval = {
    status: 'approved',
    owner: 'LK Portal product owner',
    approvedAt: fixture.registry.generatedAt,
    evidence: ['ops/lk-portal/docs/release/lds-adoption-approval.md'],
  };

  const attestation = attestationFor(fixture, entry);
  attestation.sourceCommit = entry.sourceCommit;
  for (const { attestationIds, command } of Object.values(workflowChecks)) {
    passAttestationCheck(attestation, attestationIds, command);
  }
  return fixture;
}

function stableFixture() {
  const fixture = currentFixture();
  const stableRepository = createStableRepository();
  const previousVersion = fixture.registry.ldsVersion;
  fixture.registry.ldsVersion = stableVersion;
  fixture.registry.packageRelease = {
    channel: 'stable',
    availability: 'verified',
    releaseTag: stableTag,
    evidence: [stableEvidenceRelativePath],
    supportPolicy: stableSupportPolicyRelativePath,
    rollbackArtifact: stableRollbackRelativePath,
  };
  for (const entry of fixture.registry.entries) {
    if (entry.stage === 'registered') continue;
    for (const item of entry.packages) {
      if (ldsPackageNames.has(item.name)) {
        item.version = stableVersion;
        item.artifactPath = item.artifactPath.replace(
          `-${previousVersion}.tgz`,
          `-${stableVersion}.tgz`,
        );
      }
    }
  }
  fixture.rootDir = stableRepository.rootDir;
  fixture.stableRepository = stableRepository;
  return fixture;
}

function validate(fixture) {
  return validateConsumerAdoptionRegistry({
    rootDir: fixture.rootDir ?? rootDir,
    registry: fixture.registry,
    schema: registrySchema,
    attestationSchema,
    stableReleaseEvidenceSchema,
    attestations: fixture.attestations,
  });
}

test('current v2 registry validates its recorded release, workflow, and deployment state', () => {
  const fixture = currentFixture();
  const result = validate(fixture);
  const expected = registryCounts(fixture);
  assert.equal(result.packageReleaseChannel, fixture.registry.packageRelease.channel);
  assert.equal(result.packageAvailability, fixture.registry.packageRelease.availability);
  assert.equal(result.workflowVerified, expected.workflowVerified);
  assert.equal(result.deployed, expected.deployed);
});

test('Robot Ops cannot remain promoted when required packages regress to pre-stable versions', () => {
  const fixture = currentFixture();
  const entry = consumerEntry(fixture, 'robot-ops');
  for (const item of entry.packages.filter((pkg) => pkg.name !== '@lk-design-system/lds-robotics-ui')) {
    item.version = '0.1.0-rc.69.29';
    item.artifactPath = item.artifactPath.replace('-0.1.0.tgz', '-0.1.0-rc.69.29.tgz');
  }
  assert.throws(() => validate(fixture), /must match registry ldsVersion/);
});

test('stable package identity preserves independent workflow and deployment decisions', () => {
  const fixture = stableFixture();
  const result = validate(fixture);
  const expected = registryCounts(fixture);
  assert.equal(result.packageReleaseChannel, 'stable');
  assert.equal(result.packageAvailability, 'verified');
  assert.equal(result.workflowVerified, expected.workflowVerified);
  assert.equal(result.deployed, expected.deployed);
});

test('workflow-verified accepts all five checks and promotion evidence without changing deployment', () => {
  const fixture = workflowFixture();
  const result = validate(fixture);
  const expected = registryCounts(fixture);
  const entry = consumerEntry(fixture);
  const attestationCheckIds = attestationFor(fixture, entry).checks.map((check) => check.id);
  assert.equal(result.packageReleaseChannel, fixture.registry.packageRelease.channel);
  assert.equal(result.workflowVerified, expected.workflowVerified);
  assert.equal(result.deployed, expected.deployed);
  assert.equal(new Set(attestationCheckIds).size, attestationCheckIds.length);
});

test('current evidence dates may predate registry generation', () => {
  const fixture = workflowFixture();
  const entry = consumerEntry(fixture);
  const generatedAt = fixture.registry.generatedAt;
  attestationFor(fixture, entry).generatedAt = shiftDate(generatedAt, -3);
  entry.cleanReproducibility.verifiedAt = shiftDate(generatedAt, -2);
  entry.productOwnerApproval.approvedAt = shiftDate(generatedAt, -1);
  entry.deployment = {
    status: 'deployed',
    owner: 'LK Portal product owner',
    verifiedAt: shiftDate(generatedAt, -1),
    environment: 'production',
    evidence: ['ops/lk-portal/docs/release/deployment.md'],
    rollbackPlan: 'ops/lk-portal/docs/release/rollback.md',
  };

  const result = validate(fixture);
  const expected = registryCounts(fixture);
  assert.equal(result.workflowVerified, expected.workflowVerified);
  assert.equal(result.deployed, expected.deployed);
});

test('stage gates reject missing build and workflow evidence', async (t) => {
  await t.test('build-verified needs a production build', () => {
    const fixture = currentFixture();
    consumerEntry(fixture).checks.productionBuild.status = 'not-run';
    assert.throws(() => validate(fixture), /productionBuild|constant/);
  });

  await t.test('promoted evidence cannot be stale', () => {
    const fixture = currentFixture();
    const entry = consumerEntry(fixture);
    entry.evidenceFreshness = 'stale';
    entry.staleReason = 'consumer source changed';
    assert.throws(() => validate(fixture), /evidence must be current/);
  });

  await t.test('workflow-verified needs accessibility', () => {
    const fixture = workflowFixture();
    consumerEntry(fixture).checks.accessibility.status = 'not-run';
    assert.throws(() => validate(fixture), /accessibility|constant/);
  });

  await t.test('workflow-verified needs clean reproducibility', () => {
    const fixture = workflowFixture();
    delete consumerEntry(fixture).cleanReproducibility;
    assert.throws(() => validate(fixture), /cleanReproducibility|required property/);
  });

  await t.test('workflow-verified needs product-owner approval', () => {
    const fixture = workflowFixture();
    delete consumerEntry(fixture).productOwnerApproval;
    assert.throws(() => validate(fixture), /productOwnerApproval|required property/);
  });

  await t.test('clean reproduction must pin the promoted source commit', () => {
    const fixture = workflowFixture();
    consumerEntry(fixture).cleanReproducibility.sourceCommit = 'a'.repeat(40);
    assert.throws(() => validate(fixture), /clean reproducibility must pin sourceCommit/);
  });

  await t.test('workflow attestation must pin the promoted source commit', () => {
    const fixture = workflowFixture();
    const entry = consumerEntry(fixture);
    delete attestationFor(fixture, entry).sourceCommit;
    assert.throws(() => validate(fixture), /workflow attestation must pin sourceCommit/);
  });

  await t.test('product-owner approval must follow attestation', () => {
    const fixture = workflowFixture();
    const entry = consumerEntry(fixture);
    const generatedAt = fixture.registry.generatedAt;
    attestationFor(fixture, entry).generatedAt = generatedAt;
    entry.cleanReproducibility.verifiedAt = shiftDate(generatedAt, -2);
    entry.productOwnerApproval.approvedAt = shiftDate(generatedAt, -1);
    assert.throws(() => validate(fixture), /product-owner approval approvedAt.*must not be earlier/);
  });

  await t.test('product-owner approval must follow clean reproduction', () => {
    const fixture = workflowFixture();
    const entry = consumerEntry(fixture);
    const generatedAt = fixture.registry.generatedAt;
    attestationFor(fixture, entry).generatedAt = shiftDate(generatedAt, -2);
    entry.cleanReproducibility.verifiedAt = generatedAt;
    entry.productOwnerApproval.approvedAt = shiftDate(generatedAt, -1);
    assert.throws(() => validate(fixture), /product-owner approval approvedAt.*must not be earlier/);
  });

  await t.test('a consumer cannot duplicate a package name', () => {
    const fixture = currentFixture();
    const entry = consumerEntry(fixture);
    const duplicate = structuredClone(entry.packages[0]);
    duplicate.artifactPath = duplicate.artifactPath.replace('.tgz', '-duplicate.tgz');
    entry.packages.push(duplicate);
    assert.throws(() => validate(fixture), /duplicates package pin @lk-design-system\/lds-core/);
  });

  for (const [label, mutate] of [
    ['attestation', (fixture) => {
      const entry = consumerEntry(fixture);
      attestationFor(fixture, entry).generatedAt = shiftDate(fixture.registry.generatedAt, 1);
    }],
    ['clean reproducibility', (fixture) => {
      consumerEntry(fixture).cleanReproducibility.verifiedAt = shiftDate(
        fixture.registry.generatedAt,
        1,
      );
    }],
    ['product-owner approval', (fixture) => {
      consumerEntry(fixture).productOwnerApproval.approvedAt = shiftDate(
        fixture.registry.generatedAt,
        1,
      );
    }],
    ['deployment', (fixture) => {
      consumerEntry(fixture).deployment = {
        status: 'deployed',
        owner: 'LK Portal product owner',
        verifiedAt: shiftDate(fixture.registry.generatedAt, 1),
        environment: 'production',
        evidence: ['ops/lk-portal/docs/release/deployment.md'],
        rollbackPlan: 'ops/lk-portal/docs/release/rollback.md',
      };
    }],
  ]) {
    await t.test(`${label} date cannot be later than registry generation`, () => {
      const fixture = workflowFixture();
      mutate(fixture);
      assert.throws(() => validate(fixture), /must not be later than registry generatedAt/);
    });
  }
});

test('release and deployment decisions reject unsupported claims', async (t) => {
  await t.test('stable needs verified release metadata', () => {
    const fixture = stableFixture();
    fixture.registry.packageRelease.availability = 'not-attested';
    delete fixture.registry.packageRelease.releaseTag;
    delete fixture.registry.packageRelease.evidence;
    assert.throws(() => validate(fixture), /availability|releaseTag|required property|constant/);
  });

  await t.test('release channel must match the version', () => {
    const fixture = currentFixture();
    fixture.registry.packageRelease.channel = fixture.registry.packageRelease.channel === 'stable'
      ? 'release-candidate'
      : 'stable';
    assert.throws(() => validate(fixture), /ldsVersion|packageRelease\.channel|pattern/);
  });

  await t.test('verified release evidence paths must exist in the LDS repository', () => {
    const fixture = stableFixture();
    fixture.registry.packageRelease.evidence[0] = 'docs/references/missing-release-evidence.json';
    assert.throws(() => validate(fixture), /verified package release evidence is missing/);
  });

  await t.test('stable support policy path must exist in the LDS repository', () => {
    const fixture = stableFixture();
    fixture.registry.packageRelease.supportPolicy = 'docs/MISSING_SUPPORT_POLICY.md';
    assert.throws(() => validate(fixture), /stable supportPolicy is missing/);
  });

  await t.test('stable rollback artifact path must exist in the LDS repository', () => {
    const fixture = stableFixture();
    fixture.registry.packageRelease.rollbackArtifact = 'docs/MISSING_ROLLBACK.md';
    assert.throws(() => validate(fixture), /stable rollbackArtifact is missing/);
  });

  await t.test('verified release paths must resolve to regular files', () => {
    const fixture = stableFixture();
    fixture.registry.packageRelease.supportPolicy = 'docs';
    assert.throws(() => validate(fixture), /stable supportPolicy must be a regular file/);
  });

  await t.test('deployed needs owner, environment, evidence, and rollback plan', () => {
    const fixture = currentFixture();
    consumerEntry(fixture).deployment = { status: 'deployed' };
    assert.throws(() => validate(fixture), /owner|verifiedAt|environment|evidence|rollbackPlan|required property/);
  });
});

test('stable release contracts reject version, tag, and package-set identity drift', async (t) => {
  await t.test('structured release evidence version must match the registry', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.release.version = '0.1.1';
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(() => validate(fixture), /stable release evidence version must be 0\.1\.0/);
  });

  await t.test('structured release evidence tag must match the registry', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.release.tag = 'lds-v0.1.1';
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(() => validate(fixture), /stable release evidence tag must be lds-v0\.1\.0/);
  });

  await t.test('tag resolution must pin the release source commit', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.immutableTagVerification.resolvedCommit = 'c'.repeat(40);
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(() => validate(fixture), /tag resolution must match release sourceCommit/);
  });

  await t.test('all evidence packages must use the registry version', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.packages[0].version = '0.1.1';
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(
      () => validate(fixture),
      /stable release evidence @lk-design-system\/lds-core must use 0\.1\.0/,
    );
  });

  await t.test('the release evidence package set cannot duplicate an owner', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.packages[1].name = evidence.packages[0].name;
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(
      () => validate(fixture),
      /stable release evidence duplicates package @lk-design-system\/lds-core/,
    );
  });

  await t.test('support policy identity must match the stable version', () => {
    const fixture = stableFixture();
    writeStableContract(
      fixture.stableRepository.files.supportPolicy,
      stableContractIdentity('support-policy', {
        ldsVersion: '0.1.1',
        releaseTag: 'lds-v0.1.1',
        packages: stablePackageSet('0.1.1'),
        supportMatrix: stableSupportMatrixRelativePath,
      }),
    );
    assert.throws(() => validate(fixture), /supportPolicy identity ldsVersion must be 0\.1\.0/);
  });

  await t.test('rollback identity must match the stable tag', () => {
    const fixture = stableFixture();
    writeStableContract(
      fixture.stableRepository.files.rollbackArtifact,
      stableContractIdentity('rollback', { releaseTag: 'lds-v0.1.1' }),
    );
    assert.throws(() => validate(fixture), /rollbackArtifact identity releaseTag must be lds-v0\.1\.0/);
  });

  await t.test('support matrix must be published-verified before stable promotion', () => {
    const fixture = stableFixture();
    writeStableContract(
      fixture.stableRepository.files.supportMatrix,
      stableContractIdentity('support-matrix', { status: 'candidate-not-published' }),
    );
    assert.throws(
      () => validate(fixture),
      /supportMatrix identity status must be published-verified/,
    );
  });

  await t.test('release evidence must reference the registry support and rollback contracts', () => {
    const fixture = stableFixture();
    const evidence = readFixtureJson(fixture.stableRepository.files.releaseEvidence);
    evidence.contracts.supportPolicy = 'docs/OTHER_SUPPORT_POLICY.md';
    writeFixtureJson(fixture.stableRepository.files.releaseEvidence, evidence);
    assert.throws(
      () => validate(fixture),
      /release evidence supportPolicy must match packageRelease\.supportPolicy/,
    );
  });

  await t.test('candidate contracts cannot substantiate a published stable claim', () => {
    const fixture = stableFixture();
    writeStableContract(
      fixture.stableRepository.files.rollbackArtifact,
      stableContractIdentity('rollback', { status: 'candidate-not-published' }),
    );
    assert.throws(
      () => validate(fixture),
      /rollbackArtifact identity status must be published-verified \(found candidate-not-published\)/,
    );
  });
});
