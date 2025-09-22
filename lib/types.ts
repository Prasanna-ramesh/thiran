type ConfigPropertyDetails = {
	/**
	 * Name with which properties can be read from process.env
	 */
	name: string;

	defaultValue?: string;
};

/**
 * Configuration properties essential for this library
 */
type ConfigPropertyNames =
	| 'baseLocation'
	| 'defaultConfigFile'
	| 'additionalConfigFiles'
	| 'activeProfiles'
	| 'onProfile';

export type ConfigProperties = Record<ConfigPropertyNames, ConfigPropertyDetails>;

export type SupportedFiles = 'yaml' | 'json';

export type Strategies = {
	loaders: Record<SupportedFiles, ILoader>;
};

export interface ILoader {
	/**
	 * Each strategy can implement own way to load the config files
	 *
	 * @param configurationFileLocation Absolute path of the configuration file
	 */
	loadConfiguration(configurationFileLocation: string): unknown;
}
