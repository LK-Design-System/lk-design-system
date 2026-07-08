import { spawn, spawnSync } from 'node:child_process';

const actions = {
  'audit-runtime': {
    npm: ['audit', '--omit=dev'],
    pnpm: ['audit', '--prod'],
  },
  'pack-dry-run': {
    npm: ['pack', '--dry-run', '--ignore-scripts'],
    pnpm: ['pack', '--dry-run'],
  },
};

const action = process.argv[2];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function commandAvailable(command) {
  return spawnSync(`${command} --version`, { shell: true, stdio: 'ignore' }).status === 0;
}

function preferredManager() {
  const surface = `${process.env.npm_config_user_agent || ''} ${process.env.npm_execpath || ''}`.toLowerCase();
  if (surface.includes('pnpm')) return 'pnpm';
  return 'npm';
}

if (!actions[action]) fail(`Unknown package-manager action: ${action}`);

const preferred = preferredManager();
const fallback = preferred === 'pnpm' ? 'npm' : 'pnpm';
const manager = commandAvailable(preferred) ? preferred : commandAvailable(fallback) ? fallback : null;

if (!manager) fail('Neither npm nor pnpm is available on PATH.');

const args = actions[action][manager];
console.log(`> ${manager} ${args.join(' ')}`);

const child = spawn(`${manager} ${args.join(' ')}`, { shell: true, stdio: 'inherit' });
child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  if (code === 0) process.exit(0);
  console.error(`${manager} ${args.join(' ')} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}.`);
  process.exit(code || 1);
});
