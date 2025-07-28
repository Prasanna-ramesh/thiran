import { camelizeAndMerge, get, isObject, set } from '../../lib/utils/object';

describe('isObject', () => {
	it.each([
		['null', null],
		['array', [{ a: 1, b: 2 }]],
		['string', 'a'],
		['number', '1'],
		['boolean', true],
		['undefined', undefined],
	])('should return false for %s', (_, value) => {
		expect(isObject(value)).toBe(false);
	});

	it('should return true for object', () => {
		expect(isObject({ a: 1 })).toBe(true);
	});
});

describe('get', () => {
	it('should return the value if the key exists', () => {
		expect(get({ a: { b: { c: { d: { e: { f: 1 } } } } } }, 'a.b.c.d.e')).toMatchObject({ f: 1 });
		expect(get({ a: { b: { c: { d: { e: { f: 1 } } } } } }, 'a.b.c.d.e.f')).toBe(1);
	});

	it('should return null if the key does not exists', () => {
		expect(get({ a: { b: { c: { d: { e: { f: 1 } } } } } }, 'b.c.d.e.f')).toBe(null);
	});
});

describe('set', () => {
	it('should set object value', () => {
		expect(set({}, 'a.b.c.d', 1)).toMatchObject({ a: { b: { c: { d: 1 } } } });
	});

	it('should overwrite object value', () => {
		expect(set({ a: { b: { c: { d: 1 } } } }, 'a.b.c.d', [1, 2])).toMatchObject({
			a: { b: { c: { d: [1, 2] } } },
		});
	});
});

describe('camelizeAndMerge', () => {
	it('should camelize and merge config', () => {
		expect(camelizeAndMerge({ a: { b: 1 } }, { c: { 'kebab-case': 1 } })).toMatchObject({
			a: { b: 1 },
			c: { kebabCase: 1 },
		});

		expect(camelizeAndMerge({ a: { b: 1 } }, { a: { b: 2, c: 3 } })).toMatchObject({
			a: { b: 2, c: 3 },
		});
	});
});
