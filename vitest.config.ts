import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ['**/*.test.*'],
		globals: true,
		coverage: {
			reportsDirectory: 'coverage',
			reporter: ['lcov', 'text'],
		},
		mockReset: true,
	},
});
