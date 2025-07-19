import { resolve } from 'app-root-path';
import { YamlLoaderStrategy } from './yaml-loader.strategy';

describe('YamlLoaderStrategy', () => {
	it('should load YAML file', () => {
		// given
		const absolutePath = resolve('./test-config/test.yaml');

		// when
		const config = new YamlLoaderStrategy().loadConfiguration(absolutePath);

		// then
		expect(config).toStrictEqual([
			{
				config: {
					activate: {
						'on-profile': 'default, local',
					},
				},
				port: 3000,
				'log-levels': ['log', 'error', 'warn', 'debug'],
			},
		]);
	});
});
