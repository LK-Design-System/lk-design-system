import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const workspacePackages = ['core', 'theme', 'product', 'robotics-ui', 'compat'];

async function copyDeclarations(sourceDir, targetDir) {
  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await copyDeclarations(source, target);
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(source, target);
    }
  }
}

for (const workspacePackage of workspacePackages) {
  const packageRoot = path.join(root, 'packages', workspacePackage);
  await copyDeclarations(path.join(packageRoot, 'src'), path.join(packageRoot, 'dist'));
}

console.log(`Copied workspace declarations for ${workspacePackages.join(', ')}.`);

