import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const auditPath = 'docs/references/product-frontends/COVERAGE_AUDIT.json';
const docPath = 'docs/PRODUCT_FRONTEND_COVERAGE.md';
const roboticsExternalSurfacePath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
const requiredRepositories = [
  'LK-ROBOTICS/lk_deviceops',
  'LK-ROBOTICS/lk_visionops',
  'LK-ROBOTICS/lk_web_viz',
  'LK-ROBOTICS/lk_context_hub',
  'LK-ROBOTICS/lkrobotics-control-full-daedeok',
  'LK-ROBOTICS/lk_mlops',
];
const stages = ['discovered', 'wireframed', 'implemented', 'verified'];
const stageRank = new Map(stages.map((stage, index) => [stage, index]));
const componentDecisions = ['keep', 'redesign', 'split', 'remove', 'separate-audit'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string.`);
}

async function pathExists(reference) {
  const [relativePath] = reference.split('#');
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function assertStringArray(value, label, minimum = 0) {
  assert(Array.isArray(value), `${label} must be an array.`);
  assert(value.length >= minimum, `${label} must contain at least ${minimum} item(s).`);
  for (const [index, item] of value.entries()) {
    assertNonEmptyString(item, `${label}[${index}]`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasNamedExport(sourceText, exportName) {
  return new RegExp(`\\b${escapeRegExp(exportName)}\\b`).test(sourceText);
}

function assertUniqueStrings(value, label) {
  assert(new Set(value).size === value.length, `${label} must not contain duplicates.`);
}

const source = await readFile(path.join(root, auditPath), 'utf8');
const audit = JSON.parse(source);
const documentation = await readFile(path.join(root, docPath), 'utf8');
const runtimeExports = await readFile(path.join(root, 'src/index.js'), 'utf8');
const typeExports = await readFile(path.join(root, 'src/index.d.ts'), 'utf8');
const roboticsExternalSurface = JSON.parse(await readFile(path.join(root, roboticsExternalSurfacePath), 'utf8'));
const publicClassification = await readFile(path.join(root, 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'), 'utf8');
const layerClassification = await readFile(path.join(root, 'docs/references/wds/LAYER_CLASSIFICATION.json'), 'utf8');
const externalRuntimeExports = new Set(roboticsExternalSurface.entries.flatMap((entry) => entry.exports));
const externalImplementationEvidence = new Set(roboticsExternalSurface.entries.map((entry) => `${entry.source}.jsx`));
const externalStoryEvidence = new Set(
  Object.entries(JSON.parse(layerClassification).storyTitles)
    .filter(([, title]) => title.startsWith('LDS Robotics/'))
    .map(([file]) => file),
);

assert(roboticsExternalSurface.package?.name === '@lk-robotics/lds-robotics-ui', 'Robotics external surface must identify the published robotics package.');

function hasRuntimeExport(exportName) {
  return hasNamedExport(runtimeExports, exportName) || externalRuntimeExports.has(exportName);
}

function hasTypeExport(exportName) {
  return hasNamedExport(typeExports, exportName) || externalRuntimeExports.has(exportName);
}

function isExternalImplementationEvidence(reference) {
  return externalImplementationEvidence.has(reference);
}

function isExternalStoryEvidence(reference) {
  return externalStoryEvidence.has(reference);
}

assert(audit.schemaVersion === 2, 'Product workflow audit schemaVersion must be 2.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(audit.auditedAt), 'Product workflow audit auditedAt must use YYYY-MM-DD.');
assertNonEmptyString(audit.purpose, 'audit.purpose');
assertStringArray(audit.evidenceHierarchy, 'audit.evidenceHierarchy', 5);
assert(audit.stageDefinitions && typeof audit.stageDefinitions === 'object', 'audit.stageDefinitions must be an object.');
for (const stage of stages) {
  assertNonEmptyString(audit.stageDefinitions[stage], `audit.stageDefinitions.${stage}`);
}

assert(Array.isArray(audit.repositories), 'audit.repositories must be an array.');
assert(audit.repositories.length === requiredRepositories.length, `Audit must contain exactly ${requiredRepositories.length} repositories.`);

const repositoryIds = new Set();
const repositoryNames = new Set();
for (const repository of audit.repositories) {
  assertNonEmptyString(repository.id, 'repository.id');
  assert(!repositoryIds.has(repository.id), `Duplicate repository id: ${repository.id}`);
  repositoryIds.add(repository.id);

  assertNonEmptyString(repository.repository, `${repository.id}.repository`);
  assert(!repositoryNames.has(repository.repository), `Duplicate repository name: ${repository.repository}`);
  repositoryNames.add(repository.repository);
  assert(requiredRepositories.includes(repository.repository), `Unexpected repository: ${repository.repository}`);
  assert(/^[0-9a-f]{40}$/.test(repository.commit), `${repository.repository} must pin a full 40-character commit SHA.`);
  assertNonEmptyString(repository.frontendRoot, `${repository.id}.frontendRoot`);
  assertNonEmptyString(repository.framework, `${repository.id}.framework`);
}

for (const requiredRepository of requiredRepositories) {
  assert(repositoryNames.has(requiredRepository), `Missing required repository: ${requiredRepository}`);
}

assert(Array.isArray(audit.workflows), 'audit.workflows must be an array.');
assert(audit.workflows.length > 0, 'audit.workflows must not be empty.');

const workflowIds = new Set();
const counts = Object.fromEntries(stages.map((stage) => [stage, 0]));

for (const workflow of audit.workflows) {
  assert(/^WF-\d{2}$/.test(workflow.id), `Invalid workflow id: ${workflow.id}`);
  assert(!workflowIds.has(workflow.id), `Duplicate workflow id: ${workflow.id}`);
  workflowIds.add(workflow.id);

  assertNonEmptyString(workflow.name, `${workflow.id}.name`);
  assertNonEmptyString(workflow.userGoal, `${workflow.id}.userGoal`);
  assertNonEmptyString(workflow.trigger, `${workflow.id}.trigger`);
  assertNonEmptyString(workflow.dsBoundary, `${workflow.id}.dsBoundary`);
  assertNonEmptyString(workflow.designQuestion, `${workflow.id}.designQuestion`);
  assert(stageRank.has(workflow.stage), `${workflow.id} has invalid stage: ${workflow.stage}`);

  assertStringArray(workflow.consumers, `${workflow.id}.consumers`, 1);
  assert(new Set(workflow.consumers).size === workflow.consumers.length, `${workflow.id} has duplicate consumers.`);
  for (const consumer of workflow.consumers) {
    assert(repositoryIds.has(consumer), `${workflow.id} references unknown consumer: ${consumer}`);
  }

  assertStringArray(workflow.states, `${workflow.id}.states`, 3);
  assert(new Set(workflow.states).size === workflow.states.length, `${workflow.id} has duplicate states.`);
  assertStringArray(workflow.decisions, `${workflow.id}.decisions`, 1);
  assertStringArray(workflow.failureRecovery, `${workflow.id}.failureRecovery`, 1);

  assert(Array.isArray(workflow.sourceEvidence) && workflow.sourceEvidence.length > 0, `${workflow.id}.sourceEvidence must not be empty.`);
  const evidenceRepositories = new Set();
  for (const [index, evidence] of workflow.sourceEvidence.entries()) {
    assert(repositoryIds.has(evidence.repo), `${workflow.id}.sourceEvidence[${index}] references unknown repository: ${evidence.repo}`);
    assert(workflow.consumers.includes(evidence.repo), `${workflow.id}.sourceEvidence[${index}] repository must be a consumer.`);
    assertNonEmptyString(evidence.path, `${workflow.id}.sourceEvidence[${index}].path`);
    assert(!path.isAbsolute(evidence.path), `${workflow.id} source evidence paths must be repository-relative: ${evidence.path}`);
    assert(/^[0-9a-f]{40}$/.test(evidence.blobSha), `${workflow.id}.sourceEvidence[${index}].blobSha must be a full Git blob SHA.`);
    evidenceRepositories.add(evidence.repo);
  }
  for (const consumer of workflow.consumers) {
    assert(evidenceRepositories.has(consumer), `${workflow.id} has no pinned source evidence for consumer ${consumer}.`);
  }

  assertStringArray(workflow.wireframeEvidence, `${workflow.id}.wireframeEvidence`);
  assertStringArray(workflow.implementationEvidence, `${workflow.id}.implementationEvidence`);
  assertStringArray(workflow.storyEvidence, `${workflow.id}.storyEvidence`);
  assertStringArray(workflow.verificationEvidence, `${workflow.id}.verificationEvidence`);
  assertUniqueStrings(workflow.wireframeEvidence, `${workflow.id}.wireframeEvidence`);
  assertUniqueStrings(workflow.implementationEvidence, `${workflow.id}.implementationEvidence`);
  assertUniqueStrings(workflow.storyEvidence, `${workflow.id}.storyEvidence`);
  assertUniqueStrings(workflow.verificationEvidence, `${workflow.id}.verificationEvidence`);

  const rank = stageRank.get(workflow.stage);
  if (rank >= stageRank.get('wireframed')) {
    assert(workflow.wireframeEvidence.length > 0, `${workflow.id} is ${workflow.stage} but has no wireframe evidence.`);
  }
  if (rank >= stageRank.get('implemented')) {
    assert(workflow.implementationEvidence.length > 0, `${workflow.id} is ${workflow.stage} but has no implementation evidence.`);
    assert(workflow.storyEvidence.length > 0, `${workflow.id} is ${workflow.stage} but has no Storybook component-state evidence.`);
    for (const reference of workflow.implementationEvidence) {
      assert(reference.startsWith('components/') && reference.endsWith('.jsx'), `${workflow.id} implementation evidence must be a component implementation: ${reference}`);
      const exportName = path.basename(reference, '.jsx');
      assert(hasRuntimeExport(exportName), `${workflow.id} implementation evidence is not a runtime export: ${exportName}`);
      assert(hasTypeExport(exportName), `${workflow.id} implementation evidence is not a type export: ${exportName}`);
      assert(publicClassification.includes(`\"${exportName}\"`), `${workflow.id} implementation evidence is not publicly classified: ${exportName}`);
    }
    for (const reference of workflow.storyEvidence) {
      assert(reference.startsWith('stories/') && reference.endsWith('.stories.jsx'), `${workflow.id} story evidence must be a Storybook story file: ${reference}`);
      assert(publicClassification.includes(`\"${reference}\"`), `${workflow.id} story evidence is not in the public Storybook classification: ${reference}`);
      assert(layerClassification.includes(`\"${reference}\"`), `${workflow.id} story evidence is not in the layer classification: ${reference}`);
    }
  }
  if (rank >= stageRank.get('verified')) {
    assert(workflow.verificationEvidence.length > 0, `${workflow.id} is verified but has no interaction verification evidence.`);
    assert(workflow.verificationEvidence.includes('docs/PRODUCT_FRONTEND_COVERAGE.md#workflow-implementation-verification'), `${workflow.id} verified evidence must link the workflow closure matrix.`);
    assert(workflow.verificationEvidence.includes('scripts/check-product-frontend-coverage.mjs'), `${workflow.id} verified evidence must include the product coverage guard.`);
    assert(workflow.verificationEvidence.includes('scripts/check-storybook-accessibility.mjs'), `${workflow.id} verified evidence must include the Storybook implementation guard.`);
  }

  for (const reference of [
    ...workflow.wireframeEvidence,
    ...workflow.implementationEvidence,
    ...workflow.storyEvidence,
    ...workflow.verificationEvidence,
  ]) {
    assert(!path.isAbsolute(reference), `${workflow.id} local evidence must use a repository-relative path: ${reference}`);
    assert(
      await pathExists(reference) || isExternalImplementationEvidence(reference) || isExternalStoryEvidence(reference),
      `${workflow.id} local evidence does not exist and is not attested as an external robotics implementation or Storybook page: ${reference}`,
    );
  }

  counts[workflow.stage] += 1;
  assert(documentation.includes(workflow.id), `${docPath} must mention ${workflow.id}.`);
}

assert(Array.isArray(audit.componentDisposition), 'audit.componentDisposition must be an array.');
assert(audit.componentDisposition.length > 0, 'audit.componentDisposition must not be empty.');
assert(
  audit.componentDispositionSummary && typeof audit.componentDispositionSummary === 'object',
  'audit.componentDispositionSummary must be an object.',
);

const componentNames = new Set();
const componentPaths = new Set();
const componentCounts = Object.fromEntries(componentDecisions.map((decision) => [decision, 0]));

for (const component of audit.componentDisposition) {
  assertNonEmptyString(component.name, 'componentDisposition.name');
  assert(!componentNames.has(component.name), `Duplicate component disposition name: ${component.name}`);
  componentNames.add(component.name);

  assertNonEmptyString(component.path, `${component.name}.path`);
  assert(!path.isAbsolute(component.path), `${component.name}.path must be repository-relative.`);
  assert(!componentPaths.has(component.path), `Duplicate component disposition path: ${component.path}`);
  componentPaths.add(component.path);

  assert(componentDecisions.includes(component.decision), `${component.name} has invalid decision: ${component.decision}`);
  const implementationExists = await pathExists(component.path);
  if (component.decision === 'remove') {
    assert(!implementationExists, `${component.name} is marked remove but its implementation still exists: ${component.path}`);
    assert(!hasNamedExport(runtimeExports, component.name), `${component.name} is marked remove but remains in src/index.js.`);
    assert(!hasNamedExport(typeExports, component.name), `${component.name} is marked remove but remains in src/index.d.ts.`);
    assert(!publicClassification.includes(`\"${component.name}\"`), `${component.name} remains in the public export classification.`);
    assert(!layerClassification.includes(`${component.name}.stories.jsx`), `${component.name} story remains in the layer classification.`);
  } else if (['split', 'redesign'].includes(component.decision) && Array.isArray(component.replacementPaths) && component.replacementPaths.length > 0) {
    assert(!implementationExists, `${component.name} has replacements but its compound implementation still exists: ${component.path}`);
    assert(!hasNamedExport(runtimeExports, component.name), `${component.name} has replacements but remains in src/index.js.`);
    assert(!hasNamedExport(typeExports, component.name), `${component.name} has replacements but remains in src/index.d.ts.`);
    assert(!publicClassification.includes(`\"${component.name}\"`), `${component.name} has replacements but remains in the public export classification.`);
    assert(!layerClassification.includes(`${component.name}.stories.jsx`), `${component.name} story remains in the layer classification.`);
    assertStringArray(component.replacementPaths, `${component.name}.replacementPaths`, 1);
    for (const replacementPath of component.replacementPaths) {
      assert(!path.isAbsolute(replacementPath), `${component.name} replacement paths must be repository-relative.`);
      assert(
        await pathExists(replacementPath) || isExternalImplementationEvidence(replacementPath) || isExternalStoryEvidence(replacementPath),
        `${component.name} replacement does not exist and is not attested as an external robotics implementation or Storybook page: ${replacementPath}`,
      );
    }
  } else {
    assert(
      implementationExists || isExternalImplementationEvidence(component.path),
      `${component.name}.path does not exist and is not an attested external robotics implementation: ${component.path}`,
    );
    assert(hasRuntimeExport(component.name), `${component.name} is not a runtime export.`);
    assert(hasTypeExport(component.name), `${component.name} is not a type export.`);
  }

  assertStringArray(component.workflowIds, `${component.name}.workflowIds`);
  assert(new Set(component.workflowIds).size === component.workflowIds.length, `${component.name} has duplicate workflowIds.`);
  for (const workflowId of component.workflowIds) {
    assert(workflowIds.has(workflowId), `${component.name} references unknown workflow: ${workflowId}`);
  }
  if (component.decision === 'separate-audit') {
    assert(component.workflowIds.length === 0, `${component.name} is separate-audit and cannot count toward five-product workflows.`);
  }

  assertNonEmptyString(component.reason, `${component.name}.reason`);
  assert(documentation.includes(`\`${component.name}\``), `${docPath} must document the ${component.name} disposition.`);
  componentCounts[component.decision] += 1;
}

for (const decision of componentDecisions) {
  assert(
    audit.componentDispositionSummary[decision] === componentCounts[decision],
    `Component disposition summary ${decision} ${audit.componentDispositionSummary[decision]} does not match computed ${componentCounts[decision]}.`,
  );
}

assert(audit.summary && typeof audit.summary === 'object', 'audit.summary must be an object.');
for (const stage of stages) {
  assert(audit.summary[stage] === counts[stage], `Summary ${stage} ${audit.summary[stage]} does not match computed ${counts[stage]}.`);
}

assert(documentation.includes('판단 근거의 우선순위'), `${docPath} must document the evidence hierarchy.`);
assert(documentation.includes('기존 `34 covered / 0 partial / 0 missing` 판정은 철회한다.'), `${docPath} must explicitly reset the previous coverage claim.`);
assert(!documentation.includes('감사한 34개 재사용 역량 모두에'), `${docPath} still contains the retired all-covered claim.`);
assert(documentation.includes('npm run check:product-frontends'), `${docPath} must document the coverage check.`);

console.log(
  `Validated product workflow audit: ${audit.repositories.length} repositories, ${workflowIds.size} workflows ` +
  `(${stages.map((stage) => `${stage}=${counts[stage]}`).join(', ')}); ` +
  `${audit.componentDisposition.length} component dispositions ` +
  `(${componentDecisions.map((decision) => `${decision}=${componentCounts[decision]}`).join(', ')}).`,
);
