import express from 'express';
import { ConfigManager } from 'thiran';
import { z } from 'zod';

const tenantConfig = z.object({
	iss: z.string(),
	jwks: z.url(),
	cacheValidity: z.number(),
});

const messagingConfig = z.object({
	queueUrl: z.url(),
});

const validation = z.object({
	port: z.number(),
	logLevels: z.array(z.string()),
	auth: z.object({
		serverUrl: z.url(),
		tenantA: tenantConfig,
		tenantB: tenantConfig,
	}),
	messaging: z.object({
		tenantA: messagingConfig,
		tenantB: messagingConfig,
	}),
	database: z.object({
		type: z.string(),
		host: z.string(),
		port: z.number(),
		username: z.string(),
	}),
});

const app = express();
const configManager = new ConfigManager({
	validationSchema: validation,
	hooks: {
		beforeValidate(config) {
			return config;
		},
	},
});

configManager.load().then((config) => {
	
	app.get("/configs", (_, res) => {
		res.send(config)
	})

	app.listen(config.port, () => {
		console.log(`Server running on port ${config.port} 🚀`);
	});
});
