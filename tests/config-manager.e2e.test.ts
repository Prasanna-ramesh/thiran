import type { StandardSchemaV1 } from '@standard-schema/spec';
import { ConfigManager } from '@/lib/config-manager';

describe('ConfigManager E2E', () => {
	beforeAll(() => {
		Object.entries({
			'config.baseLocation': 'tests/sample-configurations/yaml',
			'config.additionalLocation': 'application.tenant-a.yaml, application.tenant-b.yaml',
		}).forEach(([key, value]) => {
			vi.stubEnv(key, value);
		});
	});

	it('should load and merge multiple configuration files based on profile', async () => {
		// given
		type Output = {
			database: { username: string; password: string };
			[key: string]: unknown;
		};

		const validationSchemaMock: StandardSchemaV1<Output> = {
			'~standard': {
				version: 1,
				vendor: 'test-mock',
				validate: (value) => {
					return { value: value as Output };
				},
			},
		};

		// when
		const configManager = new ConfigManager({
			validationSchema: validationSchemaMock,
			hooks: {
				beforeValidate: (config) => ({ ...config, database: { password: 'computed-password', ...config.database } }),
			},
		});

		// then
		expect(configManager.load()).resolves.toMatchObject({
			config: {
				activate: {
					onProfile: 'default, local, development',
				},
			},
			port: 3000,
			logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
			database: {
				type: 'mysql',
				host: 'localhost',
				port: 3306,
				database: 'schema-name',
				username: 'root',
				password: 'computed-password',
			},
			auth: {
				serverUrl: 'https://auth-server.local',
			},
			tenants: {
				tenantA: {
					issuer: 'https://auth-server.local/realms/tenant-a',
				},
				tenantB: {
					issuer: 'https://auth-server.local/realms/tenant-b',
				},
			},
		});
	});
});
