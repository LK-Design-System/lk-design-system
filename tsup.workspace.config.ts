import { defineConfig } from 'tsup';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const workspacePackage = process.env.LDS_WORKSPACE_PACKAGE;
const packageNames = new Set(['core', 'theme', 'product']);

if (!workspacePackage || !packageNames.has(workspacePackage)) {
  throw new Error(
    `Set LDS_WORKSPACE_PACKAGE to one of ${[...packageNames].join(', ')} before building workspace artifacts.`,
  );
}

const packageRoot = path.join('packages', workspacePackage);
const sourceRoot = path.join(packageRoot, 'src');

function sourceEntries(dir = sourceRoot) {
  const entries: Record<string, string> = {};
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(entries, sourceEntries(fullPath));
      continue;
    }
    if (!entry.isFile() || (!entry.name.endsWith('.js') && !entry.name.endsWith('.jsx'))) continue;
    const entryName = path.relative(sourceRoot, fullPath).replace(/\\/g, '/').replace(/\.(?:js|jsx)$/, '');
    entries[entryName] = fullPath;
  }
  return entries;
}

export default defineConfig({
  entry: sourceEntries(),
  format: ['esm'],
  external: [
    'react',
    'react-dom',
    '@lk-design-system/lds-core',
    '@lk-design-system/lds-theme',
    '@lk-design-system/lds-product',
    '@lk-design-system/lds-robotics-ui',
  ],
  sourcemap: true,
  splitting: true,
  clean: true,
  dts: false,
  outDir: path.join(packageRoot, 'dist'),
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
