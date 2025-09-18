import express from 'express';
import { ConfigManager } from 'thiran';
import { z } from 'zod';

const app = express();
const validation = z.object({
	port: z.number(),
	database: z.object({
		type: z.string(),
		host: z.string(),
		port: z.number(),
		username: z.string(),
	}),
});

const configManager = new ConfigManager({ validationSchema: validation });

configManager.load().then((config) => {
	console.log(config);
	app.listen(3000);
});
