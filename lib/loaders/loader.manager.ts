import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { resolve } from 'app-root-path';
import { registry } from '../helper/registry';
import type { Strategies, SupportedFiles } from '../types';

export class LoaderManager {
	private readonly supportedExtensions: Record<SupportedFiles, string[]> = {
		yaml: ['.yaml', '.yml'],
		json: ['.json'],
	};

	constructor(readonly strategies: Strategies['loaders']) {}

	/**
	 * Resolves the location of the config file and invokes load() method
	 *
	 * @internal
	 */
	loadConfigurations(): unknown[] {
		const configurationFilesLocation = this.getConfigurationFilesLocation();

		return configurationFilesLocation.map((configurationFileLocation) => {
			const isYaml = this.supportedExtensions.yaml.some((extension) => configurationFileLocation.endsWith(extension));

			if (isYaml) {
				return this.strategies.yaml.loadConfiguration(configurationFileLocation);
			}

			const isJson = this.supportedExtensions.json.some((extension) => configurationFileLocation.endsWith(extension));

			if (isJson) {
				return this.strategies.json.loadConfiguration(configurationFileLocation);
			}

			throw new Error(
				`Cannot load ${configurationFileLocation}. Only ${Object.values(this.supportedExtensions).join(',')} are supported.`
			);
		});
	}

	/**
	 * To get the absolute path and configuration files
	 *
	 *
	 * @remark
	 * Also check if the file exists. If the file is missing, an error is thrown
	 *
	 * @internal
	 *
	 * TODO: allow users to convert environment variables into object without YAML and JSON file
	 */
	private getConfigurationFilesLocation(): string[] {
		const environmentVariables = registry.strictGet('environmentVariables');
		const configProperties = registry.strictGet('configProperties');

		const { baseLocation, defaultConfigurationFile, additionalConfigurationFiles } = configProperties;

		const baseLocationValue = environmentVariables[baseLocation.name] ?? baseLocation.defaultValue;
		const defaultConfigurationFileValue =
			environmentVariables[defaultConfigurationFile.name]?.trim() ?? defaultConfigurationFile.name;
		const additionalConfigurationFilesValue =
			environmentVariables[additionalConfigurationFiles.name]?.split(',')?.map((filename) => filename.trim()) ?? [];

		if (!baseLocationValue) {
			return [];
		}

		return [defaultConfigurationFileValue, ...additionalConfigurationFilesValue].map((configFile) => {
			const pathFromRoot = resolve(join(baseLocationValue, configFile));
			const fileExists = existsSync(pathFromRoot);

			if (!fileExists) {
				throw new Error(`Unable to find the file ${pathFromRoot}`);
			}

			return pathFromRoot;
		});
	}
}
