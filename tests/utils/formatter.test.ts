import { camelCase } from '@/lib/utils/formatter';

describe('camelCase', () => {
	it.each([
		['camel-case', 'camelCase'],
		['CAMEL-CASE', 'camelCase'],
		['screaming.snakeCase', 'screaming.snakeCase'],
		['SCREAMING_SNAKE-CASE', 'screaming.snakeCase'],
	])('should camelize %s', (text, camelizedText) => {
		expect(camelCase(text)).toBe(camelizedText);
	});
});
