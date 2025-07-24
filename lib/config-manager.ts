import { defaultConfigProperties } from './constants/default-config';
import { registry } from './helper/registry';
import { LoaderManager } from './loaders/loader.manager';
import { JsonLoaderStrategy } from './loaders/strategies/json-loader.strategy';
import { YamlLoaderStrategy } from './loaders/strategies/yaml-loader.strategy';
import { Transformer } from './transformer';
import type { ConfigProperties, Strategies } from './types';
import { camelCase } from './utils/formatter';
import { logger } from './utils/logger';

export class ConfigManager {
	private readonly envSeparator = '.';
	private readonly loaderManager: LoaderManager;
	private readonly transformer: Transformer;

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
		this.transformer = new Transformer();
	}

	load() {
		const configurations = this.loaderManager.loadConfigurations();
		const transformedConfigurations = this.transformer.expand(configurations);

		// TODO: introduce hooks for the user to add dynamic config (e.g.) IAM based DB connection password
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

		// TODO: Based, on the usage, introduce expand support for environment variables (e.g.) variables with ${} value in process.env
		registry.safeSet('environmentVariables', camelizedEnvVar);
	}
}
