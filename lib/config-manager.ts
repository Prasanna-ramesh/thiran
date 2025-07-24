import { defaultConfigProperties } from './constants/default-config';
import { registry } from './helper/registry';
import { LoaderManager } from './loaders/loader.manager';
import { JsonLoaderStrategy } from './loaders/strategies/json-loader.strategy';
import { YamlLoaderStrategy } from './loaders/strategies/yaml-loader.strategy';
import { ConfigTransformer } from './transformer/config.transformer';
import type { ConfigProperties, Strategies } from './types';
import { camelCase } from './utils/formatter';
import { logger } from './utils/logger';

export class ConfigManager {
	private readonly envSeparator = '.';
	private readonly loaderManager: LoaderManager;
	private readonly configTransformer: ConfigTransformer;

	constructor(
		private readonly configProperties: ConfigProperties = defaultConfigProperties,
		private readonly strategies: Strategies = {
			loaders: {
				yaml: new YamlLoaderStrategy(),
				json: new JsonLoaderStrategy(),
			},
		}
	) {
		// setup
		this.camelizeConfigurationProperties();
		this.camelizeEnvironmentVariables();

		this.loaderManager = new LoaderManager(this.strategies.loaders);
		this.configTransformer = new ConfigTransformer();
	}

	load() {
		const configurations = this.loaderManager.loadConfigurations();
		const transformedConfigurations = this.configTransformer.expand(configurations);

		// TODO: transform and merge configurations
		logger.log(JSON.stringify(transformedConfigurations));

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

		Object.entries(process.env).forEach(([key, value]) => {
			if (key.includes(this.envSeparator)) {
				camelizedEnvVar[camelCase(key)] = value;
			} else {
				camelizedEnvVar[key] = value;
			}
		});

		registry.safeSet('environmentVariables', camelizedEnvVar);
	}
}
