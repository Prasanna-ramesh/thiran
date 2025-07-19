import { defaultConfigProperties } from './constants/default-config';
import { registry } from './helper/registry';
import { LoaderManager } from './loaders/loader.manager';
import { JsonLoaderStrategy } from './loaders/strategies/json-loader.strategy';
import { YamlLoaderStrategy } from './loaders/strategies/yaml-loader.strategy';
import type { ConfigProperties, Strategies } from './types';
import { camelCase } from './utils/formatter';
import { logger } from './utils/logger';

export class ConfigManager {
	private readonly envSeparator = '.';
	private loaderManager: LoaderManager;

	constructor(
		private readonly configProperties: ConfigProperties = defaultConfigProperties,
		private readonly strategies: Strategies = {
			loaders: {
				yaml: new YamlLoaderStrategy(),
				json: new JsonLoaderStrategy(),
			},
		}
	) {
		this.loaderManager = new LoaderManager(this.strategies.loaders);
	}

	load() {
		// setup
		this.camelizeConfigurationProperties();
		this.camelizeEnvironmentVariables();

		const configurations = this.loaderManager.loadConfigurations();

		// TODO: transform and merge configurations
		logger.log(JSON.stringify(configurations));

		// cleanup
		registry.clear();
	}

	private camelizeConfigurationProperties() {
		(Object.keys(this.configProperties) as (keyof ConfigProperties)[]).forEach((key) => {
			this.configProperties[key] = {
				...this.configProperties[key],
				name: camelCase(this.configProperties[key].name),
			};
		});

		registry.safeSet('configProperties', this.configProperties);
	}

	private camelizeEnvironmentVariables() {
		const camelizedEnvVar: Record<string, string | undefined> = {};

		Object.keys(process.env).forEach((key) => {
			if (key.includes(this.envSeparator)) {
				camelizedEnvVar[camelCase(key)] = process.env[key];
			}
		});

		registry.safeSet('environmentVariables', camelizedEnvVar);
	}
}
