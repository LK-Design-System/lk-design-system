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

console.log(`Validated that the ${rootPackage.version} package set is absent from ${registry}.`);
