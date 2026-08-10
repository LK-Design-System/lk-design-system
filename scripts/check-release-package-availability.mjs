import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registry = 'https://npm.pkg.github.com';
const packageIds = ['core', 'theme', 'product', 'compat'];
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

function registryProbe(name, version) {
  const result = spawnSync(
    npmCommand,
    ['view', `${name}@${version}`, 'version', '--json', '--registry', registry],
    { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' },
  );
  return {
    status: result.status,
    output: `${result.stdout || ''}\n${result.stderr || ''}\n${result.error?.message || ''}`.trim(),
  };
}

const rootPackage = await readJson('package.json');
const roboticsExternalSurface = await readJson('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json');
const roboticsPackage = roboticsExternalSurface.package;
assert(
  roboticsPackage.refStatus === 'published',
  `${roboticsPackage.name}@${roboticsPackage.version} is still marked ${roboticsPackage.refStatus}; verify its immutable tag and registry release, then promote the external surface to published before releasing the LDS compatibility package.`,
);
const roboticsProbe = registryProbe(roboticsPackage.name, roboticsPackage.version);
if (roboticsProbe.status !== 0) {
  throw new Error(
    `${roboticsPackage.name}@${roboticsPackage.version} must be published by its owning repository before the LDS compatibility package can be released.\n`
    + roboticsProbe.output,
  );
}
let publishedRoboticsVersion;
try {
  publishedRoboticsVersion = JSON.parse(roboticsProbe.output.split(/\r?\n/)[0]);
} catch {
  publishedRoboticsVersion = roboticsProbe.output.replace(/^"|"$/g, '');
}
assert(
  publishedRoboticsVersion === roboticsPackage.version,
  `${roboticsPackage.name} registry identity drift: expected ${roboticsPackage.version}, received ${publishedRoboticsVersion}.`,
);
for (const packageId of packageIds) {
  const manifest = await readJson(`packages/${packageId}/package.json`);
  assert(
    manifest.version === rootPackage.version,
    `${manifest.name} must use the workspace release version ${rootPackage.version}.`,
  );
  const probe = registryProbe(manifest.name, manifest.version);
  if (probe.status === 0) {
    throw new Error(`${manifest.name}@${manifest.version} already exists in ${registry}; release versions are immutable.`);
  }
  if (!/\bE404\b|\b404\b|not found/i.test(probe.output)) {
    throw new Error(
      `Could not verify whether ${manifest.name}@${manifest.version} is available in ${registry}. `
      + `Only an explicit 404 permits publishing; registry authentication and transport failures must stop the release.\n${probe.output}`,
    );
  }
}

console.log(
  `Validated external Robotics prerequisite ${roboticsPackage.version} and confirmed that the ${rootPackage.version} LDS package set is absent from ${registry}.`,
);
