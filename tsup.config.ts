import { defineConfig } from 'tsup';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const externalizedComponentPrefixes = new Set([
  'components/editor/CanvasEditorCommandBar.jsx',
  'components/editor/CanvasEditorShell.jsx',
  'components/editor/EditorToolbar.jsx',
  'components/editor/HistoryToolbar.jsx',
  'components/editor/LayerPanel.jsx',
  'components/editor/SelectionInspector.jsx',
  'components/editor/ViewportStatusBar.jsx',
  'components/navigation/FloorSelector.jsx',
  'components/robotics/',
  'components/viz/Map2DCanvas.jsx',
  'components/viz/Scene3DFrame.jsx',
  'components/viz/TelemetryGauge.jsx',
  'components/viz/TelemetryValue.jsx',
  'components/viz/VideoStreamTile.jsx',
  'components/viz/ViewerFrame.jsx',
  'components/viz/ViewerToolbar.jsx',
]);

function componentEntries(dir = 'components') {
  const entries: Record<string, string> = {};
  const items = readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      Object.assign(entries, componentEntries(fullPath));
    } else if (item.isFile() && item.name.endsWith('.jsx') && !item.name.endsWith('.stories.jsx')) {
      const normalizedPath = fullPath.replace(/\\/g, '/');
      if ([...externalizedComponentPrefixes].some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(prefix))) continue;
      const entryName = fullPath.replace(/\\/g, '/').replace(/\.jsx$/, '');
      entries[entryName] = fullPath;
    }
  }
  return entries;
}

export default defineConfig({
  entry: {
    index: 'src/index.js',
    core: 'src/core.js',
    theme: 'src/theme.js',
    product: 'src/product.js',
    robotics: 'src/robotics.js',
    ...componentEntries(),
  },
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom', '@lk-robotics/lds-robotics-ui'],
  sourcemap: true,
  splitting: true,
  clean: true,
  dts: false,
  outDir: 'dist',
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
