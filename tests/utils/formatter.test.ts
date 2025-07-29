import { camelCase } from '@/lib/utils/formatter';

describe('camelCase', () => {
	it.each(['camel-case'])('should camelize %s', (text) => {
		expect(camelCase(text)).toBe('camelCase');
	});
});
