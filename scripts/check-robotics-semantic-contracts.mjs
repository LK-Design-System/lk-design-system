import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
// Robotics contracts live in this repository, but their implementations,
// type surfaces, and pilot stories live in the external Robotics repository —
// the same split check:robotics-storybook-browser handles with --root.
const roboticsRootArg = process.argv.find((arg) => arg.startsWith('--root='))?.slice('--root='.length);
const roboticsRoot = path.resolve(root, roboticsRootArg || '../lk-design-system-robotics');
const contractRoots = [root, path.join(roboticsRoot, 'src'), roboticsRoot];

function resolveContractPath(rel) {
  for (const base of contractRoots) {
    const candidate = path.join(base, rel);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

const registryPath = path.join(root, 'docs/references/robotics/SEMANTIC_CONTRACTS.json');
const productAuditPath = path.join(root, 'docs/references/product-frontends/COVERAGE_AUDIT.json');
const allowedTones = new Set(['neutral', 'signal', 'positive', 'cautionary', 'negative']);
const allowedKinds = new Set(['stable', 'transition']);

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read valid JSON from ${path.relative(root, filePath)}: ${error.message}`);
  }
}

function unique(values) {
  return new Set(values).size === values.length;
}

function quotedTypeValues(source, exportName) {
  const match = source.match(new RegExp(`export\\s+type\\s+${exportName}\\s*=([\\s\\S]*?);`));
  if (!match) fail(`Missing exported type ${exportName}.`);
  return Array.from(match[1].matchAll(/'([^']+)'/g), (item) => item[1]);
}

assert(existsSync(registryPath), 'Missing robotics semantic contract registry.');
assert(existsSync(productAuditPath), 'Missing product frontend coverage audit.');

const registry = readJson(registryPath);
const productAudit = readJson(productAuditPath);
const axes = registry.axes || {};
const axisNames = Object.keys(axes);

assert(registry.schemaVersion === 1, 'Unsupported semantic registry schemaVersion.');
assert(registry.metadata?.status === 'active-pilot' || registry.metadata?.status === 'active', 'Registry status must be active-pilot or active.');
assert(Array.isArray(registry.metadata?.owner) && registry.metadata.owner.length >= 2, 'Registry needs cross-functional owners.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(registry.metadata?.lastReviewed || ''), 'Registry lastReviewed must use YYYY-MM-DD.');
assert(axisNames.length >= 8, 'Registry must define the agreed operational truth axes.');
assert(Array.isArray(registry.principles) && registry.principles.length >= 6, 'Registry must preserve the semantic invariants.');
assert(unique(registry.principles.map((principle) => principle.id)), 'Semantic principle ids must be unique.');

for (const [axisName, axis] of Object.entries(axes)) {
  assert(axis.definition && axis.productOwns && axis.ldsOwns, `${axisName} must define meaning and ownership boundaries.`);
  assert(Array.isArray(axis.values) && axis.values.length >= 2, `${axisName} must define at least two values.`);
  const ids = axis.values.map((value) => value.id);
  assert(unique(ids), `${axisName} value ids must be unique.`);
  for (const value of axis.values) {
    assert(value.id && value.labelKo, `${axisName} values need id and labelKo.`);
    assert(allowedTones.has(value.tone), `${axisName}.${value.id} uses an unsupported visual tone ${value.tone}.`);
    assert(allowedKinds.has(value.kind), `${axisName}.${value.id} must be stable or transition.`);
  }
  if (axisName !== 'urgency') {
    assert(ids.includes('unknown'), `${axisName} must keep unknown as a first-class state.`);
  }
}

assert(axes.transport.values.some((value) => value.id === 'connected'), 'Transport must define connected.');
assert(!axes.transport.values.some((value) => ['ready', 'online', 'stale'].includes(value.id)), 'Transport must not mix readiness, online aliases, or freshness.');
assert(axes.freshness.values.some((value) => value.id === 'stale'), 'Freshness must own stale.');
assert(axes.operability.values.some((value) => value.id === 'available'), 'Operability must own available.');
assert(axes.urgency.values.some((value) => value.id === 'critical'), 'Urgency must own critical.');

for (const mapping of registry.componentMappings || []) {
  const typePath = resolveContractPath(mapping.path);
  assert(
    typePath,
    `${mapping.component} type contract does not exist at ${mapping.path} `
    + `(searched this repository and ${path.relative(root, roboticsRoot)}; pass --root=<robotics checkout> if it lives elsewhere).`,
  );
  assert(Array.isArray(mapping.axes) && mapping.axes.length > 0, `${mapping.component} must map at least one semantic axis.`);
  assert(mapping.axes.every((axis) => axisNames.includes(axis)), `${mapping.component} maps an unknown semantic axis.`);
  assert((mapping.doesNotOwn || []).every((axis) => axisNames.includes(axis)), `${mapping.component} excludes an unknown semantic axis.`);
  assert(!mapping.axes.some((axis) => (mapping.doesNotOwn || []).includes(axis)), `${mapping.component} cannot own and exclude the same axis.`);

  if (mapping.typeExport) {
    const source = readFileSync(typePath, 'utf8');
    const typeValues = quotedTypeValues(source, mapping.typeExport);
    const registryValues = axes[mapping.axes[0]].values.map((value) => value.id);
    assert(JSON.stringify(typeValues) === JSON.stringify(registryValues), `${mapping.component} ${mapping.typeExport} must exactly match the ${mapping.axes[0]} registry order.`);
  }

  if (mapping.promptPath) {
    const promptPath = resolveContractPath(mapping.promptPath);
    assert(promptPath, `${mapping.component} prompt is missing at ${mapping.promptPath}.`);
    const prompt = readFileSync(promptPath, 'utf8');
    for (const asset of mapping.requiredProductAssets || []) {
      assert(prompt.includes(asset), `${mapping.component} prompt must record the ${asset} workflow decision.`);
    }
    for (const source of registry.research || []) {
      assert(prompt.includes(source.url), `${mapping.component} prompt must trace ${source.title}.`);
    }
  }

  if (mapping.storyPath && mapping.typeExport) {
    const storyPath = resolveContractPath(mapping.storyPath);
    assert(storyPath, `${mapping.component} story is missing at ${mapping.storyPath}.`);
    const story = readFileSync(storyPath, 'utf8');
    for (const value of axes[mapping.axes[0]].values) {
      assert(story.includes(`connectionState=\"${value.id}\"`), `${mapping.component} story must render ${value.id}.`);
    }
    assert(/play\s*:/.test(story), `${mapping.component} pilot story needs a play contract.`);
  }
}

const repositories = new Set((productAudit.repositories || []).map((repository) => repository.id));
const workflows = new Map((productAudit.workflows || []).map((workflow) => [workflow.id, workflow]));
for (const pilot of registry.pilotWorkflows || []) {
  const workflow = workflows.get(pilot.id);
  assert(workflow, `Pilot workflow ${pilot.id} is missing from product coverage.`);
  assert(workflow.stage === pilot.stage, `Pilot workflow ${pilot.id} stage drifted from ${pilot.stage} to ${workflow.stage}.`);
  assert(pilot.products.every((product) => repositories.has(product)), `Pilot workflow ${pilot.id} references an unpinned product.`);
  assert(pilot.axes.every((axis) => axisNames.includes(axis)), `Pilot workflow ${pilot.id} references an unknown semantic axis.`);
  assert(Array.isArray(workflow.sourceEvidence) && workflow.sourceEvidence.length > 0, `Pilot workflow ${pilot.id} needs pinned source evidence.`);
}

for (const source of registry.research || []) {
  assert(source.title && source.conclusion, 'Research evidence needs a title and concrete conclusion.');
  assert(/^https:\/\//.test(source.url || ''), `${source.title || 'Research source'} needs an HTTPS URL.`);
}

console.log(
  `Validated robotics semantic contracts: ${axisNames.length} axes, `
  + `${Object.values(axes).reduce((count, axis) => count + axis.values.length, 0)} values, `
  + `${registry.componentMappings.length} component mappings, `
  + `${registry.pilotWorkflows.length} pinned workflow pilots.`,
);
