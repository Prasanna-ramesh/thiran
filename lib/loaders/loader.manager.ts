import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { resolve } from 'app-root-path';
import { DEFAULT_PROFILE_NAME } from '../constants/default-config';
import { registry, type Store } from '../helper/registry';
import type { Strategies, SupportedFiles } from '../types';
import { camelizeAndMerge, get, isObject } from '../utils/object';

export class LoaderManager {
	private readonly supportedExtensions: Record<SupportedFiles, string[]> = {
		yaml: ['.yaml', '.yml'],
		json: ['.json'],
	};

	private readonly environmentVariables: Store['environmentVariables'];
	private readonly configProperties: Store['configProperties'];
	private readonly activeProfiles: string[];

	constructor(private readonly loader: Strategies['loaders']) {
		this.environmentVariables = registry.strictGet('environmentVariables');
		this.configProperties = registry.strictGet('configProperties');

		const { activeProfiles } = this.configProperties;
		this.activeProfiles = (this.environmentVariables[activeProfiles.name] ?? activeProfiles.defaultValue)
			?.split(',')
			.map((value) => value.trim()) ?? [DEFAULT_PROFILE_NAME];
	}

	/**
	 * Invokes loader strategy based on the file extension
	 *
	 * @internal
	 */
	loadConfigurations(): Record<string, unknown> {
		const configurationFilesLocation = this.getConfigurationFilesLocation();

		return configurationFilesLocation
			.flatMap((configurationFileLocation) => {
				const isYaml = this.supportedExtensions.yaml.some((extension) => configurationFileLocation.endsWith(extension));

				if (isYaml) {
					return this.loader.yaml.loadConfiguration(configurationFileLocation);
				}

				const isJson = this.supportedExtensions.json.some((extension) => configurationFileLocation.endsWith(extension));

				if (isJson) {
					return this.loader.json.loadConfiguration(configurationFileLocation);
				}

				throw new Error(
					`Cannot load ${configurationFileLocation}. Only ${Object.values(this.supportedExtensions).join(',')} are supported.`
				);
			})
			.reduce((accumulator: Record<string, unknown>, current) => this.mergeConfig(accumulator, current), {});
	}

	/**
	 * To get the absolute path and configuration files
	 *
	 *
	 * @remark
	 * Also checks if the file exists. If the file is missing, an error is thrown
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

	private mergeConfig(mergedConfig: Record<string, unknown>, config: unknown): Record<string, unknown> {
		if (!isObject(config)) {
			return mergedConfig;
		}

		const profileInConfig = get<string>(config, this.configProperties.onProfile.name);

		const isDefaultProfileActive = profileInConfig === null && this.activeProfiles.includes(DEFAULT_PROFILE_NAME);
		const isActiveProfile = profileInConfig && this.activeProfiles.includes(profileInConfig);

		const shouldMerge = isDefaultProfileActive || isActiveProfile;
		if (shouldMerge) {
			return camelizeAndMerge(mergedConfig, config);
		}

		// At this point, the profile
		return mergedConfig;
	}
}
