import { readFileSync } from 'node:fs';
import { resolve } from 'app-root-path';
import { JsonLoaderStrategy } from '../../../lib/loaders/strategies/json-loader.strategy';

vi.mock('node:fs', async (requireActual) => ({
	...(await requireActual()),
	readFileSync: vi.fn(),
}));

describe('JsonLoaderStrategy', () => {
	it('should load JSON files', () => {
		// given
		const absolutePath = resolve('./test-config/test.json');
		vi.mocked(readFileSync).mockImplementation((path) => {
			if (path !== absolutePath) {
				throw new Error('Invalid path');
			}

			return JSON.stringify({
				config: {
					activate: {
						'on-profile': 'default, local',
					},
				},
				port: 3000,
				'log-levels': ['log', 'error', 'warn', 'debug'],
			});
		});

		// when
		const config = new JsonLoaderStrategy().loadConfiguration(absolutePath);

		// then
		expect(config).toStrictEqual({
			config: {
				activate: {
					'on-profile': 'default, local',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		});
	});
});
