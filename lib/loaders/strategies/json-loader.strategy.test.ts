import { resolve } from 'app-root-path';
import { JsonLoaderStrategy } from './json-loader.strategy';

describe('JsonLoaderStrategy', () => {
	it('should load JSON files', () => {
		// given
		const absolutePath = resolve('./test-config/test.json');

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
