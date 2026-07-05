import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');

await mkdir(distDir, { recursive: true });
await copyFile(path.join(root, 'src', 'index.d.ts'), path.join(distDir, 'index.d.ts'));

console.log('Copied src/index.d.ts to dist/index.d.ts.');
