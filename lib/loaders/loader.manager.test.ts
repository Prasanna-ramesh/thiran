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
		{
			config: {
				activate: {
					'on-profile': '${PROFILE}',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		},
		{ 'yaml-loader': true },
		{ config: { activate: { 'on-profile': 'default, local' } } },
	],
} satisfies ILoader;

const jsonLoaderMock = {
	loadConfiguration: () => [
		{
			config: {
				activate: {
					'on-profile': '${PROFILE}',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		},
		{ 'json-loader': true },
		{ config: { activate: { 'on-profile': 'default, local' } } },
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
		expect(loaderManager.loadConfigurations()).toStrictEqual({
			config: {
				activate: {
					onProfile: 'default, local',
				},
				location: defaultConfigurationFileName,
			},
			port: 3000,
			logLevels: ['log', 'error', 'warn', 'debug'],
			yamlLoader: true,
		});
	});

	it('should invoke JSON loader for filename ending with .json extension', () => {
		// given
		registry.safeSet('environmentVariables', {
			[defaultConfigProperties.defaultConfigurationFile.name]: 'application.json',
		});

		const loaderManager = new LoaderManager({ yaml: yamlLoaderMock, json: jsonLoaderMock });
		vi.mocked(existsSync).mockReturnValue(true);

		// when / then
		expect(loaderManager.loadConfigurations()).toStrictEqual({
			config: {
				activate: {
					onProfile: 'default, local',
				},
				location: 'application.json',
			},
			port: 3000,
			logLevels: ['log', 'error', 'warn', 'debug'],
			jsonLoader: true,
		});
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
