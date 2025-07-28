import { defaultConfigProperties } from '../lib/constants/default-config';
import { registry } from '../lib/helper/registry';
import { Transformer } from '../lib/transformer';

describe('Transformer', () => {
	const transformer = new Transformer();

	beforeAll(() => {
		registry.safeSet('configProperties', defaultConfigProperties);
		registry.safeSet('environmentVariables', {
			PROFILE: 'default, local',
		});
	});

	it('should replace the value from existing configuration', () => {
		// given
		const configurations = {
			config: {
				defaultProfile: 'development',
				activate: {
					onProfile: '${config.defaultProfile}',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		};

		// when / then
		expect(transformer.expand(configurations)).toMatchObject({
			config: {
				activate: {
					onProfile: 'development',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		});
	});

	it('should replace the value from environment variables', () => {
		// given
		const configurations = {
			config: {
				activate: {
					onProfile: '${PROFILE}',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		};

		// when / then
		expect(transformer.expand(configurations)).toMatchObject({
			config: {
				activate: {
					onProfile: 'default, local',
				},
			},
			port: 3000,
			'log-levels': ['log', 'error', 'warn', 'debug'],
		});
	});
});
