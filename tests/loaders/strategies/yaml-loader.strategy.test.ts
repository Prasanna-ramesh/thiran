import { readFileSync } from 'node:fs';
import { resolve } from 'app-root-path';
import { YamlLoaderStrategy } from '@/lib/loaders/strategies/yaml-loader.strategy';

vi.mock('node:fs', async (requireActual) => ({
	...(await requireActual()),
	readFileSync: vi.fn(),
}));

const yamlContent = /* yaml */ `
config:
  activate:
    on-profile: \${PROFILE}
port: 3000
log-levels:
  - log
  - error
  - warn
  - debug

`;

describe('YamlLoaderStrategy', () => {
	it('should load YAML file', () => {
		// given
		const absolutePath = resolve('./test-config/test.yaml');
		vi.mocked(readFileSync).mockImplementation((path) => {
			if (path !== absolutePath) {
				throw new Error('Invalid path');
			}

			return yamlContent;
		});

		// when
		const config = new YamlLoaderStrategy().loadConfiguration(absolutePath);

		// then
		expect(config).toStrictEqual([
			{
				config: {
					activate: {
						'on-profile': '${PROFILE}',
					},
				},
				port: 3000,
				'log-levels': ['log', 'error', 'warn', 'debug'],
			},
		]);
	});
});
