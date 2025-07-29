import { camelCase } from './formatter';

/**
 * Function that asserts if a given unknown value is a non-array object
 *
 * @param value Unknown value
 * @returns True, if the value is an object
 *
 * @internal
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
	return Boolean(value) && !Array.isArray(value) && typeof value === 'object';
};

/**
 * Function that asserts if a given unknown value is an object
 *
 * @param value Unknown value
 * @returns if the a given value is either an array or object
 *
 * @internal
 */
export const isArrayOrObject = (value: unknown): value is Record<string, unknown> | Record<string, unknown>[] =>
	Boolean(value) && typeof value === 'object';

/**
 * Get value of a key (or nested key) from an object.
 * Equivalent to .get() from lodash
 *
 * @param object Actual object
 * @param path key of the property. In case of nested property, it's dot separated
 * @param camelize If set to true, the keys will be camelized before obtaining the value from object
 *
 * @internal
 */
export const get = <T>(object: unknown, path: string, camelize: boolean = false): T | null => {
	if (!isObject(object)) {
		return null;
	}

	const keys = path.split('.');
	let currentObject: Record<string, unknown> = object;

	for (const key of keys) {
		const normalizedObject =
			camelize && isObject(currentObject)
				? Object.fromEntries(Object.entries(currentObject).map(([key, value]) => [camelCase(key), value]))
				: currentObject;

		if (isObject(normalizedObject) && key in normalizedObject) {
			currentObject = normalizedObject[key] as Record<string, unknown>;
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
 * @param path Nested key separated by dot
 *
 * @internal
 */
export const camelizeAndMerge = (
	target: Record<string, unknown>,
	source: unknown,
	path: string = ''
): Record<string, unknown> => {
	if (!isObject(source)) {
		if (path === '') {
			throw new Error('Invalid source. Configurations cannot be merged.');
		} else {
			return set(target, path, source);
		}
	}

	Object.entries(source).forEach(([key, value]) => {
		const newPath = path ? `${path}.${camelCase(key)}` : camelCase(key);

		if (typeof value === 'object') {
			camelizeAndMerge(target, value, newPath);
		} else {
			set(target, newPath, value);
		}
	});

	return target;
};

/**
 * Set object value for a given path
 *
 * @param object Source object
 * @param path Nested key separated by dot
 * @param value Value to overwrite at the last segment
 *
 * @internal
 */
export const set = (object: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> => {
	if (!isObject(object)) {
		throw new Error('Invalid object');
	}

	let currentObject = object;

	const segments = path.split('.').map((_path) => _path.trim());
	for (let count = 0; count < segments.length; count += 1) {
		const segment = segments[count];
		if (count === segments.length - 1) {
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
