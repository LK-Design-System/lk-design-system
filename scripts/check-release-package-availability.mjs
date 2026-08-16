import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registry = 'https://npm.pkg.github.com';
const packageIds = ['core', 'theme', 'product'];
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

// The Robotics package used to be a registry prerequisite because the
// compatibility facade declared it as a runtime dependency: publishing the
// facade without it would have produced an uninstallable package. That facade
// was removed in Wave 5, and none of the packages published here depend on
// Robotics, so the prerequisite no longer has anything to protect.
//
// It was also unsatisfiable. The Robotics repository has no publish workflow —
// it ships as the vendored tarball pinned in ROBOTICS_EXTERNAL_SURFACE.json —
// so the probe returned 403 and every tagged release run failed at this gate.
// The vendored artifact is verified by sha256 in check:publish-policy and
// check:pack, which is the check that matches how the package is actually
// distributed.
const roboticsExternalSurface = await readJson('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json');
assert(
  roboticsExternalSurface.vendoredArtifact?.path && roboticsExternalSurface.vendoredArtifact?.sha256,
  'The external surface must pin the vendored Robotics tarball path and SHA-256.',
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
  `Confirmed that the ${rootPackage.version} LDS package set is absent from ${registry}; Robotics ships as the vendored tarball pinned by the external surface.`,
);
