import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateConsumerAdoptionRegistry } from './check-consumer-adoption-registry.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adoptionRoot = path.join(rootDir, 'docs/references/adoption');
const ldsPackageNames = new Set([
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
]);
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
  const previousVersion = fixture.registry.ldsVersion;
  fixture.registry.ldsVersion = '1.0.0';
  fixture.registry.packageRelease = {
    channel: 'stable',
    availability: 'verified',
    releaseTag: 'lds-v1.0.0',
    evidence: ['package.json', 'docs/references/SATELLITE_PIN_REPORT.md'],
    supportPolicy: 'docs/OPERATING_MODEL.md',
    rollbackArtifact: 'docs/PACKAGE_MIGRATION_GUIDE.md',
  };
  for (const entry of fixture.registry.entries) {
    for (const item of entry.packages) {
      if (ldsPackageNames.has(item.name)) {
        item.version = '1.0.0';
        item.artifactPath = item.artifactPath.replace(
          `-${previousVersion}.tgz`,
          '-1.0.0.tgz',
        );
      }
    }
  }
  return fixture;
}

function validate(fixture) {
  return validateConsumerAdoptionRegistry({
    rootDir,
    registry: fixture.registry,
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
    fixture.registry.packageRelease.evidence[1] = 'docs/references/missing-release-evidence.json';
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
