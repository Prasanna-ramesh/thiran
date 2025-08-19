import type { StandardSchemaV1 } from '@standard-schema/spec';
import { ConfigManager } from '@/lib/config-manager';
import { registry } from '@/lib/helper/registry';
import { LoaderManager } from '@/lib/loaders/loader.manager';

const validationSchemaMock: StandardSchemaV1 = {
	'~standard': {
		version: 1,
		vendor: 'test-mock',
		validate: () => ({
			value: {},
		}),
	},
};

describe('ConfigManager', () => {
	it('should set required keys in registry before invoking config loader', () => {
		// given
		vi.spyOn(LoaderManager.prototype, 'loadConfigurations').mockImplementation(() => {
			return {
				environmentVariables: registry.strictGet('environmentVariables'),
				configProperties: registry.strictGet('configProperties'),
			};
		});

		// when / then
		const configManager = new ConfigManager({ validationSchema: validationSchemaMock });
		expect(() => configManager.load()).not.toThrow();
	});

	it('should throw error when configuration are access before loading', () => {
		const configManager = new ConfigManager({ validationSchema: validationSchemaMock });

		expect(() => configManager.config).toThrowError('Configuration not loaded');
	});
});
