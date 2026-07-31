import { defineConfig } from 'tsup';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const workspacePackage = process.env.LDS_WORKSPACE_PACKAGE;
const packageNames = new Set(['core', 'theme', 'product', 'compat']);
const requestedFormat = process.env.LDS_WORKSPACE_FORMAT;

if (!workspacePackage || !packageNames.has(workspacePackage)) {
  throw new Error(
    `Set LDS_WORKSPACE_PACKAGE to one of ${[...packageNames].join(', ')} before building workspace artifacts.`,
  );
}

if (requestedFormat && !['esm', 'cjs'].includes(requestedFormat)) {
  throw new Error('LDS_WORKSPACE_FORMAT must be esm or cjs when it is set.');
}
if (requestedFormat && workspacePackage !== 'compat') {
  throw new Error('LDS_WORKSPACE_FORMAT is only valid for the compatibility facade.');
}

const packageRoot = path.join('packages', workspacePackage);
const sourceRoot = path.join(packageRoot, 'src');
const implementationPackageNames = [
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
  '@lk-robotics/lds-robotics-ui',
];
const formats = workspacePackage === 'compat'
  ? (requestedFormat ? [requestedFormat] : ['esm', 'cjs'])
  : ['esm'];
const compatibilityCjsBuild = workspacePackage === 'compat' && formats.includes('cjs');

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
  format: formats,
  external: [
    'react',
    'react-dom',
    // CJS compatibility cannot synchronously require the ESM-only packages.
    // Bundle their already-built public modules only into the CJS facade;
    // ESM retains direct package re-exports for normal tree shaking.
    ...(compatibilityCjsBuild ? [] : implementationPackageNames),
  ],
  sourcemap: true,
  // CJS facade entries share implementation chunks so root, layer, and deep
  // compatibility imports retain the same component references.
  splitting: workspacePackage !== 'compat' || compatibilityCjsBuild,
  clean: !(workspacePackage === 'compat' && requestedFormat === 'cjs'),
  dts: false,
  outDir: path.join(packageRoot, 'dist'),
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
