import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const surfaces = [
  ['Table', 'components/data/Table.jsx'],
  ['DataGrid', 'components/data/DataGrid.jsx'],
];

for (const [name, relativePath] of surfaces) {
  const file = path.join(root, relativePath);
  const source = await readFile(file, 'utf8');
  if (!source.includes('data-scroll-gutter="auto"')) {
    throw new Error(`${name} must default data-scroll-gutter to auto.`);
  }
  if (!source.includes("scrollbarGutter: 'auto'")) {
    throw new Error(`${name} must default scrollbarGutter to auto.`);
  }
  if (source.includes('data-scroll-gutter="stable"') || source.includes("scrollbarGutter: 'stable'")) {
    throw new Error(`${name} must not reserve a stable gutter by default.`);
  }
}

console.log('Table and DataGrid default to auto scrollbar gutters; explicit style overrides remain available.');
