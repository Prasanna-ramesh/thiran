import { camelCase } from './formatter';

/**
 * Function that asserts if a given unknown type is an object using type guard
 *
 * @param object Actual object
 *
 * @internal
 */
export const isObject = (object: unknown): object is Record<string, unknown> => {
	return Boolean(object) && !Array.isArray(object) && typeof object === 'object';
};

/**
 * Get value of a key (or nested key) from an object.
 * Equivalent to .get() from lodash
 *
 * @param object Actual object
 * @param path key of the property. Incase of nested property, it's dot separated
 *
 * @internal
 */
export const get = <T>(object: unknown, path: string): T | null => {
	if (!isObject(object)) {
		return null;
	}

	const keys = path.split('.');
	let currentObject: unknown = object;

	for (const key of keys) {
		if (currentObject && typeof currentObject === 'object' && key in currentObject) {
			currentObject = (currentObject as Record<string, unknown>)[key];
		} else {
			return null;
		}
	}

	return currentObject as T;
};

/**
 * To camelize the key and merge the keys recursively
 *
 * @param target Target Object
 * @param source Source Object
 * @param segments
 *
 * @internal
 */
export const camelizeAndMerge = (
	target: Record<string, unknown>,
	source: unknown,
	segments: string[] = []
): Record<string, unknown> => {
	if (!isObject(source)) {
		throw new Error('[objectUtil.camelizeAndMerge] Invalid source object');
	}

	Object.entries(source).forEach(([key, value]) => {
		if (typeof value === 'object') {
			camelizeAndMerge(target, source, [...segments, camelCase(key)]);
		} else {
			set(target, segments, value);
		}
	});

	return target;
};

/**
 * Set object value for a given segments
 *
 * @param object Source object
 * @param segments Nested segments in a given object
 * @param value Value to overwrite at the last segment
 *
 * @internal
 */
const set = (object: Record<string, unknown>, segments: string[], value: unknown): Record<string, unknown> => {
	if (!isObject(object)) {
		throw new Error('[objectUtil.set] Invalid object');
	}

	let currentObject = object;

	for (const segment of segments) {
		if (segments.at(-1) === segment) {
			currentObject[segment] = value;
		} else {
			if (!(segment in currentObject)) {
				currentObject[segment] = {};
			}
			currentObject = currentObject[segment] as Record<string, unknown>;
		}
	}

	return object;
};
