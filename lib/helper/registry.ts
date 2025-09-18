import { ForbiddenException } from '@/lib/utils/exception';
import type { ConfigProperties } from '../types';

export type Store = {
	envVars: Record<string, string | undefined>;
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
	private readonly store = new Map<keyof Store, Store[keyof Store]>();

	/**
	 * Allows setting the key only once. Overriding the key will result in error
	 *
	 * @param key Name of key in the store
	 * @param value Value to set
	 *
	 * @throws ForbiddenException when the key already exists in the store
	 */
	safeSet<Key extends keyof Store>(key: Key, value: Store[Key]) {
		const existingValue = this.store.get(key);

		if (existingValue) {
			throw new ForbiddenException(`${key} already exists in the store`);
		}

		this.store.set(key, value);
	}

	/**
	 * To retrieve a key from teh store
	 *
	 * @param key Name of key in the store
	 *
	 * @throws InvalidConfigException when the key is missing
	 *
	 * @internal
	 */
	strictGet<Key extends keyof Store>(key: Key): Store[Key] {
		const value = this.store.get(key);

		if (!value) {
			throw new ForbiddenException(`${key} is missing in the store`);
		}

		return value as Store[Key];
	}

	clear(): void {
		this.store.clear();
	}
}

export const registry = new Registry();
