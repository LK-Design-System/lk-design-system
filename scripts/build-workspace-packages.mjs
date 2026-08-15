import { spawnSync } from 'node:child_process';
import path from 'node:path';

const workspacePackages = ['core', 'theme', 'product'];
const tsupCli = path.join(process.cwd(), 'node_modules', 'tsup', 'dist', 'cli-default.js');

for (const workspacePackage of workspacePackages) {
  const result = spawnSync(process.execPath, [tsupCli, '--config', 'tsup.workspace.config.ts', '--silent'], {
    cwd: process.cwd(),
    env: { ...process.env, LDS_WORKSPACE_PACKAGE: workspacePackage },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Workspace package build failed for ${workspacePackage} (exit ${result.status}).`);
  }
}
