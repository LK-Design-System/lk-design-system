import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roboticsArg = process.argv.find((argument) => argument.startsWith('--root='))?.slice('--root='.length);
const roboticsRoot = path.resolve(root, roboticsArg || '../lk-design-system-robotics');
const readinessPath = path.join(root, 'docs/references/robotics/READINESS.json');
const productAuditPath = path.join(root, 'docs/references/product-frontends/COVERAGE_AUDIT.json');

function fail(message) { throw new Error(`Robotics readiness failed: ${message}`); }
function assert(condition, message) { if (!condition) fail(message); }
function readJson(filePath, label) {
  try { return JSON.parse(readFileSync(filePath, 'utf8')); }
  catch (error) { fail(`${label} is not valid JSON (${error.message})`); }
}
function file(relativePath) {
  const isLdsEvidence = relativePath.startsWith('lds:');
  const normalizedPath = isLdsEvidence ? relativePath.slice('lds:'.length) : relativePath;
  const evidenceRoot = isLdsEvidence ? root : roboticsRoot;
  const candidate = path.join(evidenceRoot, normalizedPath);
  assert(existsSync(candidate), `missing ${isLdsEvidence ? 'LDS' : 'Robotics'} evidence ${relativePath}`);
  return readFileSync(candidate, 'utf8');
}

const readiness = readJson(readinessPath, 'READINESS.json');
const audit = readJson(productAuditPath, 'product frontend audit');
assert(readiness.schemaVersion === 1 && readiness.kind === 'lds-robotics-readiness', 'unsupported readiness document');
assert(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(readiness.lastReviewed), 'lastReviewed must use YYYY-MM-DD');
assert(readiness.claimBoundary.includes('not a robot safety case'), 'readiness claim boundary must reject safety certification inference');
assert(readiness.browserGate?.status === 'passed' && readiness.browserGate.seriousAxeViolations === 0, 'Robotics browser gate must be passed with zero serious Axe violations');
assert(Array.isArray(readiness.stages) && readiness.stages.length === 4, 'readiness must define O1 through O4');

const stages = new Map(readiness.stages.map((stage) => [stage.id, stage]));
for (const id of ['O1', 'O2', 'O3', 'O4']) assert(stages.has(id), `missing readiness stage ${id}`);
for (const id of ['O1', 'O2']) {
  const stage = stages.get(id);
  assert(stage.status === 'ready' && stage.supportedClaim === true, `${id} must be ready and claimable`);
  assert(stage.workflowIds.length > 0, `${id} must cite a verified workflow`);
  for (const evidence of stage.evidence) file(evidence);
  for (const workflowId of stage.workflowIds) {
    const workflow = audit.workflows.find((candidate) => candidate.id === workflowId);
    assert(workflow?.stage === 'verified', `${id} workflow ${workflowId} is not verified in the product audit`);
  }
}

const fleetStory = file('stories/RoboticsFleetOverview.stories.jsx');
assert(/play\s*:/.test(fleetStory) && fleetStory.includes('FleetHealthSummary') && fleetStory.includes('FleetRobotRow'), 'O1 fleet story must exercise summary, rows, and interaction checks');
assert(/stale|unavailable|critical/.test(fleetStory), 'O1 fleet story must include non-ready truth states');

const manualStory = file('stories/RoboticsManualControlSession.stories.jsx');
assert(/play\s*:/.test(manualStory), 'O2 manual-control story must include interaction checks');
for (const term of ['ManualControlSession', 'deadman', 'onSafetyReleaseRequest', 'onStopRequest', 'focus', 'linkState']) {
  assert(manualStory.includes(term), `O2 manual-control story is missing ${term}`);
}

assert(stages.get('O3').status === 'unverified' && stages.get('O3').supportedClaim === false, 'O3 must remain explicitly unverified');
assert(stages.get('O4').status === 'unsupported' && stages.get('O4').supportedClaim === false, 'O4 must remain explicitly unsupported');
assert(stages.get('O3').reason && stages.get('O4').reason, 'O3/O4 need explicit reasons');

const packageJson = readJson(path.join(roboticsRoot, 'package.json'), 'Robotics package.json');
assert(packageJson.name === '@lk-design-system/lds-robotics-ui', 'Robotics package identity drifted');
assert(packageJson.peerDependencies?.['@lk-design-system/lds-core'], 'Robotics package must declare Core peer compatibility');
assert(packageJson.peerDependencies?.['@lk-design-system/lds-product'], 'Robotics package must declare Product peer compatibility');

console.log(`Validated Robotics readiness: O1/O2 ready, O3 unverified, O4 unsupported (${roboticsRoot}).`);
