import { registry } from './helper/registry';
import { get, isArrayOrObject } from './utils/object';

export class Transformer {
	// RegExp to replace key with value ${}
	private readonly keyToReplaceRegex = /\$\{([^}]*)\}/g;
	private mergedConfigurationsClone: Record<string, unknown> = {};

	/**
	 * Replaces ${} with corresponding value from environment variable or nested key.
	 *
	 * @param mergedConfigurations Loaded and merged configuration object
	 * @returns Expanded and merged configurations
	 *
	 * @throws Error when the key to be replaced is not available in environment variables or in the existing configuration
	 */
	expand(mergedConfigurations: Record<string, unknown>) {
		this.mergedConfigurationsClone = structuredClone(mergedConfigurations);

		return this.recursiveExpand(mergedConfigurations);
	}

	private recursiveExpand(configurations: Record<string, unknown> | Record<string, unknown>[]): NonNullable<object> {
		if (Array.isArray(configurations)) {
			return configurations.map((configuration) =>
				isArrayOrObject(configuration) ? this.recursiveExpand(configuration) : configuration
			);
		}

		const configEntries = Object.entries(configurations).map(([key, value]) => {
			const transformedValue = isArrayOrObject(value) ? this.recursiveExpand(value) : this.transformValue(value);

			return [key, transformedValue];
		});

		return Object.fromEntries(configEntries);
	}

	private transformValue(value: unknown): unknown {
		if (typeof value === 'string') {
			return this.replaceKey(value);
		}

		return value;
	}

	private replaceKey(value: string): string {
		return value.replaceAll(this.keyToReplaceRegex, (_, keyToReplace) => {
			const valueFromEnvVar = registry.strictGet('envVars')[keyToReplace];

			if (valueFromEnvVar) {
				return valueFromEnvVar;
			}

			const valueFromExistingConfig = get(this.mergedConfigurationsClone, keyToReplace);

			if (typeof valueFromExistingConfig === 'string') {
				return valueFromExistingConfig;
			}

			if (valueFromEnvVar && typeof valueFromExistingConfig !== 'string') {
				throw new Error(`Invalid reference. ${keyToReplace} is not a string rather ${typeof valueFromExistingConfig}`);
			}

			throw new Error(`Unable to find the key ${keyToReplace}`);
		});
	}
}
