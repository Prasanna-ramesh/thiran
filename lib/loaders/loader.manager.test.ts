import { existsSync } from 'node:fs';
import { defaultConfigProperties } from '../constants/default-config';
import { registry } from '../helper/registry';
import type { ILoader } from '../types';
import { LoaderManager } from './loader.manager';

vi.mock('app-root-path', () => ({
	resolve: (path: string) => path,
}));
vi.mock('node:fs', () => ({
	existsSync: vi.fn(),
}));

const yamlLoaderMock = {
	loadConfiguration: vi.fn(),
} satisfies ILoader;

const jsonLoaderMock = {
	loadConfiguration: vi.fn(),
} satisfies ILoader;

describe('LoaderManager', () => {
	const loaderManager = new LoaderManager({ yaml: yamlLoaderMock, json: jsonLoaderMock });

	beforeEach(() => {
		registry.safeSet('configProperties', defaultConfigProperties);
	});

	afterEach(() => {
		registry.clear();
	});

	it.each([
		['filename ending with .yaml extension', 'application.yaml'],
		['filename ending with .yml extension', 'application.yml'],
	])('should invoke YAML loader for %s', (_, defaultConfigurationFileName) => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: defaultConfigurationFileName,
		});
		vi.mocked(existsSync).mockReturnValue(true);

		// when
		loaderManager.loadConfigurations();

		// then
		expect(yamlLoaderMock.loadConfiguration).toHaveBeenCalledTimes(1);
	});

	it('should invoke JSON loader for filename ending with .json extension', () => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: 'application.json',
		});
		vi.mocked(existsSync).mockReturnValue(true);

		// when
		loaderManager.loadConfigurations();

		// then
		expect(jsonLoaderMock.loadConfiguration).toHaveBeenCalledTimes(1);
	});

	it('should throw error for unsupported extension', () => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: 'application.txt',
		});
		vi.mocked(existsSync).mockReturnValue(true);

		// when / then
		expect(() => loaderManager.loadConfigurations()).toThrow(
			new Error('Cannot load config/application.txt. Only .yaml,.yml,.json are supported.')
		);
	});
});
