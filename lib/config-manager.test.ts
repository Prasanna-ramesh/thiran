import { ConfigManager } from './config-manager';
import { registry } from './helper/registry';
import { LoaderManager } from './loaders/loader.manager';

describe('ConfigManager', () => {
	it('should set required keys in registry before invoking config loader', () => {
		// given
		vi.spyOn(LoaderManager.prototype, 'loadConfigurations').mockImplementation(() => {
			return [
				{
					environmentVariables: registry.strictGet('environmentVariables'),
					configProperties: registry.strictGet('configProperties'),
				},
			];
		});

		// when / then
		const configManager = new ConfigManager();
		expect(() => configManager.load()).not.toThrow();
	});
});
