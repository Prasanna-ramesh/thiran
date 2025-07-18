import type { ConfigProperties } from '../types';

type Store = {
	environmentVariables: Record<string, string | undefined>;
	configProperties: ConfigProperties;
};

/**
 * Registry that holds the common/global data in the map
 * This is used to prevent passing data and can be accessed directly wherever is required
 * Also, the key once set cannot be overridden
 *
 * @internal
 */
class Registry {
	private store = new Map<keyof Store, Store[keyof Store]>();

	/**
	 * Allows setting the key only once. Overriding the key will result in error
	 *
	 * @param key Name of key in the store
	 * @param value Value to set
	 */
	safeSet<Key extends keyof Store>(key: Key, value: Store[Key]) {
		const existingValue = this.store.get(key);

		if (existingValue) {
			throw new Error(`${key} is already available in the store`);
		}

		this.store.set(key, value);
	}

	/**
	 * Throws an error if the key is missing in the store
	 *
	 * @param key Name of key in the store
	 */
	strictGet<Key extends keyof Store>(key: Key): Store[Key] {
		const value = this.store.get(key);

		if (!value) {
			throw new Error(`${key} is missing in the store`);
		}

		return value as Store[Key];
	}

	clear(): void {
		this.store.clear();
	}
}

export const registry = new Registry();
