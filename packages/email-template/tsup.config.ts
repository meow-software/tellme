import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],       // CJS -> dist/index.js, ESM -> dist/index.mjs
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  target: 'esnext'
});
