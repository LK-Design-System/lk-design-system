#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE_ROOTS = ['components', 'src'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(absolute);
    if (!entry.isFile() || !SOURCE_EXTENSIONS.has(path.extname(entry.name))) return [];
    return [absolute];
  });
}

let normalized = 0;
for (const file of SOURCE_ROOTS.flatMap(collectSourceFiles)) {
  const source = readFileSync(file, 'utf8');
  if (!source.includes('\r\n')) continue;
  writeFileSync(file, source.replaceAll('\r\n', '\n'), 'utf8');
  normalized += 1;
}

console.log(`Normalized ${normalized} source file line ending(s) to LF.`);
