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
				beforeValidate: <MaybeValidConfig extends Partial<Config>>(
					config: MaybeValidConfig
				) => MaybeValidConfig | Promise<MaybeValidConfig>;
			};
		}
	) {
		// setup
		this.camelizeConfigProperties();
		this.camelizeEnvVars();

		this.loaderManager = new LoaderManager(this.strategies.loaders);
		this.transformer = new Transformer();
	}

	/**
	 * Orchestrator for loading configuration using different strategies.
	 * After loading the configuration, validates the result with the schema validator
	 *
	 * @throws Error
	 * */
	async load() {
		const mergedConfigurations = this.loaderManager.loadConfigurations();
		const transformedConfigurations = this.transformer.expand(mergedConfigurations);

		const hydratedConfigurations =
			this.settings.hooks?.beforeValidate(transformedConfigurations) ?? transformedConfigurations;

		const { validate, version, vendor } = this.settings.validationSchema['~standard'];
		logger.log(`Validation with Standard Schema version ${version} using ${vendor} vendor`);

		const result = await validate(hydratedConfigurations);

		// cleanup
		registry.clear();

		if (!result.issues) {
			this._config = result.value;

			return this._config;
		}

		const issues = result.issues.map(({ message, path  }) => {
			const fullPath = path?.map((segment) =>  typeof segment === 'object' ? segment.key : segment).join('.') ?? 'Missing path in issues'
			
			return `Path: ${fullPath}. Message: ${message}`

		}).join('\n');

		throw new Error(`Validation failed. Reason: \n ${issues}`);
	}

	private camelizeConfigProperties() {
		for (const key of Object.keys(this.configProperties) as (keyof ConfigProperties)[]) {
			this.configProperties[key] = {
				...this.configProperties[key],
				name: camelCase(this.configProperties[key].name),
			};
		}

		registry.safeSet('configProperties', this.configProperties);
	}

	/**
	 * Camelizes the environment variables and stores in the registry.
	 * Both original and camelized keys are stored.
	 * The main reason to store both is that the key in the env variable and the config property can be diferent casing.
	 *
	 * (e.g.) Base location property name configured as `config.baseLocation` but is available in env variable as `CONFIG_BASE-LOCATION` or `config.base-location`
	 * */
	private camelizeEnvVars() {
		const camelizedEnvVars: Record<string, string | undefined> = {};

		for (const [key, value] of Object.entries(process.env)) {
			camelizedEnvVars[camelCase(key)] = value;
			camelizedEnvVars[key] = value;
		}

		registry.safeSet('envVars', camelizedEnvVars);
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
