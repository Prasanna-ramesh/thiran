import { camelCase } from './formatter';

describe('camelCase', () => {
	it.each(['camel-case'])('should camelize %s', (text) => {
		expect(camelCase(text)).toBe('camelCase');
	});
});
