import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const entryDeclarationNames = ['index', 'core', 'theme', 'product', 'robotics'];

await mkdir(distDir, { recursive: true });
await Promise.all(entryDeclarationNames.map((name) => (
  copyFile(path.join(root, 'src', `${name}.d.ts`), path.join(distDir, `${name}.d.ts`))
)));

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

console.log(
  `Copied ${entryDeclarationNames.length} entry declaration files and `
    + `${copiedComponents} component declaration files to dist.`,
);
