import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const scriptNames = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, scriptName) {
  const binDir = path.join(root, 'node_modules', '.bin');
  const env = {
    ...process.env,
    PATH: `${binDir}${path.delimiter}${process.env.PATH || ''}`,
  };

  console.log(`\n> ${scriptName}`);
  console.log(`> ${command}`);

  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd: root,
      env,
      shell: true,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}.`));
    });
  });
}

if (scriptNames.length === 0) fail('Usage: node scripts/run-package-scripts.mjs <script> [...script]');

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const scripts = packageJson.scripts || {};

for (const scriptName of scriptNames) {
  const command = scripts[scriptName];
  if (!command) fail(`Unknown package script: ${scriptName}`);
  await run(command, scriptName);
}
