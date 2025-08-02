import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['./lib/index.ts'],
	dts: true,
	format: ['cjs', 'esm'],
	clean: true,
	outDir: 'dist',
});
