// Launch-config wrapper: Storybook's CLI only accepts --port as a flag, so this
// forwards the harness-assigned PORT env (autoPort) after regenerating colors.
import { spawnSync, spawn } from 'node:child_process';

const port = process.env.PORT || '6006';
const isWindows = process.platform === 'win32';

const generate = spawnSync('node', ['scripts/generate-lk-color-system.mjs'], { stdio: 'inherit' });
if (generate.status !== 0) process.exit(generate.status ?? 1);

const child = spawn(
  isWindows ? 'npx.cmd' : 'npx',
  ['storybook', 'dev', '-p', String(port), '--host', '127.0.0.1', '--no-open', '--ci'],
  { stdio: 'inherit', shell: isWindows },
);
child.on('exit', (code) => process.exit(code ?? 0));
