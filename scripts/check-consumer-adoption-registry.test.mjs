import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateConsumerAdoptionRegistry } from './check-consumer-adoption-registry.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adoptionRoot = path.join(rootDir, 'docs/references/adoption');

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

function workflowFixture() {
  const fixture = currentFixture();
  const entry = fixture.registry.entries.find((item) => item.id === 'portal');
  entry.stage = 'workflow-verified';
  entry.checks.accessibility = {
    status: 'passed',
    command: 'npm.cmd run test:a11y -- --portal-workflow',
  };
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

  const attestation = fixture.attestations[entry.attestation];
  attestation.sourceCommit = entry.sourceCommit;
  attestation.checks.push({
    id: 'accessibility',
    status: 'passed',
    command: 'npm.cmd run test:a11y -- --portal-workflow',
  });
  return fixture;
}

function stableFixture() {
  const fixture = currentFixture();
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
      if (['@lk-design-system/lds-core', '@lk-design-system/lds-theme', '@lk-design-system/lds-product'].includes(item.name)) {
        item.version = '1.0.0';
        item.artifactPath = item.artifactPath.replace('0.1.0-rc.69.29', '1.0.0');
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

test('current v2 registry remains truthful at build-verified', () => {
  const result = validate(currentFixture());
  assert.equal(result.packageReleaseChannel, 'release-candidate');
  assert.equal(result.workflowVerified, 0);
  assert.equal(result.deployed, 0);
});

test('stable package identity is valid without implying workflow verification or deployment', () => {
  const result = validate(stableFixture());
  assert.equal(result.packageReleaseChannel, 'stable');
  assert.equal(result.packageAvailability, 'verified');
  assert.equal(result.workflowVerified, 0);
  assert.equal(result.deployed, 0);
});

test('workflow-verified accepts all five checks, clean-clone reproduction, and owner approval without deployment', () => {
  const result = validate(workflowFixture());
  assert.equal(result.packageReleaseChannel, 'release-candidate');
  assert.equal(result.workflowVerified, 1);
  assert.equal(result.deployed, 0);
});

test('current evidence dates may predate registry generation', () => {
  const fixture = workflowFixture();
  const entry = fixture.registry.entries[0];
  fixture.attestations[entry.attestation].generatedAt = '2026-08-19';
  entry.cleanReproducibility.verifiedAt = '2026-08-20';
  entry.productOwnerApproval.approvedAt = '2026-08-21';
  entry.deployment = {
    status: 'deployed',
    owner: 'LK Portal product owner',
    verifiedAt: '2026-08-21',
    environment: 'production',
    evidence: ['ops/lk-portal/docs/release/deployment.md'],
    rollbackPlan: 'ops/lk-portal/docs/release/rollback.md',
  };

  const result = validate(fixture);
  assert.equal(result.workflowVerified, 1);
  assert.equal(result.deployed, 1);
});

test('stage gates reject missing build and workflow evidence', async (t) => {
  await t.test('build-verified needs a production build', () => {
    const fixture = currentFixture();
    fixture.registry.entries[0].checks.productionBuild.status = 'not-run';
    assert.throws(() => validate(fixture), /productionBuild|constant/);
  });

  await t.test('promoted evidence cannot be stale', () => {
    const fixture = currentFixture();
    fixture.registry.entries[0].evidenceFreshness = 'stale';
    fixture.registry.entries[0].staleReason = 'consumer source changed';
    assert.throws(() => validate(fixture), /evidence must be current/);
  });

  await t.test('workflow-verified needs accessibility', () => {
    const fixture = workflowFixture();
    fixture.registry.entries[0].checks.accessibility.status = 'not-run';
    assert.throws(() => validate(fixture), /accessibility|constant/);
  });

  await t.test('workflow-verified needs clean reproducibility', () => {
    const fixture = workflowFixture();
    delete fixture.registry.entries[0].cleanReproducibility;
    assert.throws(() => validate(fixture), /cleanReproducibility|required property/);
  });

  await t.test('workflow-verified needs product-owner approval', () => {
    const fixture = workflowFixture();
    delete fixture.registry.entries[0].productOwnerApproval;
    assert.throws(() => validate(fixture), /productOwnerApproval|required property/);
  });

  await t.test('clean reproduction must pin the promoted source commit', () => {
    const fixture = workflowFixture();
    fixture.registry.entries[0].cleanReproducibility.sourceCommit = 'a'.repeat(40);
    assert.throws(() => validate(fixture), /clean reproducibility must pin sourceCommit/);
  });

  await t.test('workflow attestation must pin the promoted source commit', () => {
    const fixture = workflowFixture();
    delete fixture.attestations['attestations/lk-portal.json'].sourceCommit;
    assert.throws(() => validate(fixture), /workflow attestation must pin sourceCommit/);
  });

  await t.test('product-owner approval must follow attestation', () => {
    const fixture = workflowFixture();
    fixture.attestations['attestations/lk-portal.json'].generatedAt = '2026-08-20';
    fixture.registry.entries[0].cleanReproducibility.verifiedAt = '2026-08-18';
    fixture.registry.entries[0].productOwnerApproval.approvedAt = '2026-08-19';
    assert.throws(() => validate(fixture), /product-owner approval approvedAt.*must not be earlier/);
  });

  await t.test('product-owner approval must follow clean reproduction', () => {
    const fixture = workflowFixture();
    fixture.attestations['attestations/lk-portal.json'].generatedAt = '2026-08-18';
    fixture.registry.entries[0].cleanReproducibility.verifiedAt = '2026-08-20';
    fixture.registry.entries[0].productOwnerApproval.approvedAt = '2026-08-19';
    assert.throws(() => validate(fixture), /product-owner approval approvedAt.*must not be earlier/);
  });

  await t.test('a consumer cannot duplicate a package name', () => {
    const fixture = currentFixture();
    const duplicate = structuredClone(fixture.registry.entries[0].packages[0]);
    duplicate.artifactPath = duplicate.artifactPath.replace('.tgz', '-duplicate.tgz');
    fixture.registry.entries[0].packages.push(duplicate);
    assert.throws(() => validate(fixture), /duplicates package pin @lk-design-system\/lds-core/);
  });

  for (const [label, mutate] of [
    ['attestation', (fixture) => {
      fixture.attestations['attestations/lk-portal.json'].generatedAt = '2026-08-23';
    }],
    ['clean reproducibility', (fixture) => {
      fixture.registry.entries[0].cleanReproducibility.verifiedAt = '2026-08-23';
    }],
    ['product-owner approval', (fixture) => {
      fixture.registry.entries[0].productOwnerApproval.approvedAt = '2026-08-23';
    }],
    ['deployment', (fixture) => {
      fixture.registry.entries[0].deployment = {
        status: 'deployed',
        owner: 'LK Portal product owner',
        verifiedAt: '2026-08-23',
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
    fixture.registry.packageRelease.channel = 'stable';
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
    fixture.registry.entries[0].deployment.status = 'deployed';
    assert.throws(() => validate(fixture), /owner|verifiedAt|environment|evidence|rollbackPlan|required property/);
  });
});
