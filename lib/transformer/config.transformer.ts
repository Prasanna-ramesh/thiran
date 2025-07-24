import { registry } from '../helper/registry';
import { get, isObject } from '../utils/object';

export class ConfigTransformer {
	// RegExp to replace key with value ${}
	private readonly keyToReplaceRegex = /\$\{([^}]*)\}/g;
	private configurationsClone: Record<string, unknown> = {};

	expand(configurations: Record<string, unknown>) {
		this.configurationsClone = structuredClone(configurations);

		return this.recursiveExpand(configurations);
	}

	private recursiveExpand(configurations: Record<string, unknown> | Record<string, unknown>[]): NonNullable<object> {
		if (Array.isArray(configurations)) {
			return configurations.map((configuration) =>
				isObject(configuration) ? this.recursiveExpand(configuration) : configuration
			);
		}

		const configEntires = Object.entries(configurations).map(([key, value]) => {
			const transformedValue = isObject(value) ? this.recursiveExpand(value) : this.transformValue(value);

			return [key, transformedValue];
		});

		return Object.fromEntries(configEntires);
	}

	private transformValue(value: unknown): unknown {
		if (typeof value === 'string') {
			return this.replaceKey(value);
		}

		return value;
	}

	private replaceKey(value: string) {
		return value.replaceAll(this.keyToReplaceRegex, (_, keyToReplace) => {
			const fromEnvironmentVariables = registry.strictGet('environmentVariables')[keyToReplace];

			if (fromEnvironmentVariables) {
				return fromEnvironmentVariables;
			}

			const fromConfig = get<string>(this.configurationsClone, keyToReplace);

			if (fromConfig) {
				return fromConfig;
			}

			throw new Error(`[ConfigTransform.replaceKey] Unable to find the key ${keyToReplace}`);
		});
	}
}
