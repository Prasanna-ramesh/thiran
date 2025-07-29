import { defaultConfigProperties } from '@/lib/constants/default-config';
import { registry } from '@/lib/helper/registry';

describe('registry', () => {
	afterEach(() => {
		registry.clear();
	});

	it('should throw error during set when the key already exists', () => {
		// given
		registry.safeSet('configProperties', defaultConfigProperties);

		// when / then
		expect(() => registry.safeSet('configProperties', defaultConfigProperties)).toThrowError(
			'configProperties already exists in the store'
		);
	});

	it('should throw error when getting unavailable key', () => {
		// given
		registry.safeSet('configProperties', defaultConfigProperties);

		// when / then
		expect(() => registry.strictGet('environmentVariables')).toThrowError(
			'environmentVariables is missing in the store'
		);
	});
});
