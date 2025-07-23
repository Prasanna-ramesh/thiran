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
	loadConfiguration: () => [
		{ a: { b: { c: { d: 1, 'yaml-loader': true } } } },
		{ a: { b: { c: { d: 2 } } } },
		{ a: { c: 1 } },
	],
} satisfies ILoader;

const jsonLoaderMock = {
	loadConfiguration: () => [
		{ a: { b: { c: { d: 1, 'json-loader': true } } } },
		{ a: { b: { c: { d: 2 } } } },
		{ a: { c: 1 } },
	],
} satisfies ILoader;

describe('LoaderManager', () => {
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

		const loaderManager = new LoaderManager({ yaml: yamlLoaderMock, json: jsonLoaderMock });
		vi.mocked(existsSync).mockReturnValue(true);

		// when / then
		expect(loaderManager.loadConfigurations()).toMatchObject({ a: { b: { c: { d: 2, yamlLoader: true } }, c: 1 } });
	});

	it('should invoke JSON loader for filename ending with .json extension', () => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: 'application.json',
		});

		const loaderManager = new LoaderManager({ yaml: yamlLoaderMock, json: jsonLoaderMock });
		vi.mocked(existsSync).mockReturnValue(true);

		// when / then
		expect(loaderManager.loadConfigurations()).toMatchObject({ a: { b: { c: { d: 2, jsonLoader: true } }, c: 1 } });
	});

	it('should throw error for unsupported extension', () => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: 'application.txt',
		});

		const loaderManager = new LoaderManager({ yaml: yamlLoaderMock, json: jsonLoaderMock });
		vi.mocked(existsSync).mockReturnValue(true);

		// when / then
		expect(() => loaderManager.loadConfigurations()).toThrow(
			new Error('Cannot load config/application.txt. Only .yaml,.yml,.json are supported.')
		);
	});
});
