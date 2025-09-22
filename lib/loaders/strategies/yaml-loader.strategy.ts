import { readFileSync } from 'node:fs';
import { parseAllDocuments } from 'yaml';
import type { ILoader } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

/**
 * YAML config file loader.
 * Parsing merge key seem to be fail by the underlying parser. So only **YAML 1.2** is supported for now.
 *
 * @internal
 */
export class YamlLoaderStrategy implements ILoader {
	loadConfiguration(configurationFileLocation: string): unknown {
		const content = readFileSync(configurationFileLocation, 'utf-8');

		const parsedDocument = parseAllDocuments(content).map(({ contents }) => contents?.toJSON());
		logger.debug(`Loaded YAML file from ${configurationFileLocation}`);

		return parsedDocument;
	}
}
