import type { StandardSchemaV1 } from '@standard-schema/spec';
import { defaultConfigProperties } from './constants/default-config';
import { registry } from './helper/registry';
import { LoaderManager } from './loaders/loader.manager';
import { JsonLoaderStrategy } from './loaders/strategies/json-loader.strategy';
import { YamlLoaderStrategy } from './loaders/strategies/yaml-loader.strategy';
import { Transformer } from './transformer';
import type { ConfigProperties, Strategies } from './types';
import { camelCase } from './utils/formatter';
import { logger } from './utils/logger';

export class ConfigManager<Config = unknown> {
	private readonly envSeparator = '.';

	private readonly configProperties: ConfigProperties = defaultConfigProperties;
	private readonly strategies: Strategies = {
		loaders: {
			yaml: new YamlLoaderStrategy(),
			json: new JsonLoaderStrategy(),
		},
	};

	private readonly loaderManager: LoaderManager;
	private readonly transformer: Transformer;

	private _config: Config | null = null;

	constructor(
		private readonly settings: {
			validationSchema: StandardSchemaV1<Config>;
			hooks?: {
				/**
				 * To hydrate config before performing validation
				 */
				beforeValidate: <HydratedConfig extends Partial<Config>>(
					config: HydratedConfig
				) => HydratedConfig | Promise<HydratedConfig>;
			};
		}
	) {
		// setup
		this.camelizeConfigurationProperties();
		this.camelizeEnvironmentVariables();

		this.loaderManager = new LoaderManager(this.strategies.loaders);
		this.transformer = new Transformer();
	}

	async load() {
		const mergedConfigurations = this.loaderManager.loadConfigurations();
		const transformedConfigurations = this.transformer.expand(mergedConfigurations);

		const hydratedConfigurations =
			this.settings.hooks?.beforeValidate(transformedConfigurations) ?? transformedConfigurations;

		const { validate, version, vendor } = this.settings.validationSchema['~standard'];
		logger.log(`Validation with Standard Schema version ${version} using ${vendor} vendor`);

		const result = await validate(hydratedConfigurations);
		if (!result.issues) {
			this._config = result.value;

			// cleanup
			registry.clear();

			return this._config;
		}

		result.issues.forEach(({ message }) => {
			logger.error(message);
		});

		throw new Error('Validation failed. Terminating process');
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

		// TODO: Based on the usage, support expanding environment variables (e.g.) variables with ${} value in process.env
		registry.safeSet('environmentVariables', camelizedEnvVar);
	}

	/**
	 * Loaded configurations
	 *
	 * @throws {@link Error} when config is not initialized
	 * */
	get config(): Config {
		if (!this._config) {
			throw new Error('Configuration not loaded');
		}

		return this._config;
	}
}
