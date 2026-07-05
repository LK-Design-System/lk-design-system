import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom'],
  sourcemap: true,
  clean: true,
  dts: false,
  outDir: 'dist',
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
