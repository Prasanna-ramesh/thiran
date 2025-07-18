import { readFileSync } from 'node:fs';
import type { ILoader } from '@/lib/types';

/**
 * JSON config file loader
 *
 * @internal
 */
export class JsonLoaderStrategy implements ILoader {
	loadConfiguration(configurationFileLocation: string): unknown {
		const contentString = readFileSync(configurationFileLocation, 'utf-8');

		const content = JSON.parse(contentString);
		return content;
	}
}
