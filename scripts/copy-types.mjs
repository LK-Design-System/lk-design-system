import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');

await mkdir(distDir, { recursive: true });
await copyFile(path.join(root, 'src', 'index.d.ts'), path.join(distDir, 'index.d.ts'));

async function copyDeclarations(sourceDir, targetDir) {
  let copied = 0;
  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copied += await copyDeclarations(source, target);
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      await mkdir(targetDir, { recursive: true });
      await copyFile(source, target);
      copied += 1;
    }
  }
  return copied;
}

const copiedComponents = await copyDeclarations(path.join(root, 'components'), path.join(distDir, 'components'));

console.log(`Copied src/index.d.ts and ${copiedComponents} component declaration files to dist.`);
