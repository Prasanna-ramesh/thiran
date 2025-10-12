import type { ConfigProperties } from '../types';

export const DEFAULT_PROFILE_NAME = 'default';

export const defaultConfigProperties: ConfigProperties = {
	/**
	 * Base location where default and additional configuration files can be found
	 *
	 * @defaultValue
	 * config.baseLocation = ./config
	 * Instead of config.baseLocation, config.base-location or CONFIG_BASE-LOCATION can be used
	 */
	baseLocation: {
		name: 'config.baseLocation',
		defaultValue: './config',
	},
	/**
	 * Location of the base config file
	 *
	 * @defaultValue
	 * config.file = application.yaml
	 */
	defaultConfigFile: {
		name: 'config.file',
		defaultValue: 'application.yaml',
	},
	/**
	 * Additional configuration file(s).
	 * In case of multiple files, separate them with commas
	 *
	 * @defaultValue
	 * This has no default value
	 * Instead of config.additionalFiles, **config.additional-location or CONFIG_ADDITIONAL-LOCATION** can be used
	 *
	 * @example
	 * config.additionalFiles = application-dev.yaml,application-tenant.yaml
	 */
	additionalConfigFiles: {
		name: 'config.additionalFiles',
	},
	/**
	 * Currently active profile(s). Should be set through env variable.
	 * In case of multiple profiles, separate profile with comma
	 *
	 * @defaultValue
	 * profiles.active=default
	 *
	 * @example
	 * Single profile
	 * profiles.active=development
	 *
	 * Multiple profile
	 * profiles.active=development,local,default
	 **/
	activeProfiles: {
		name: 'profiles.active',
		defaultValue: DEFAULT_PROFILE_NAME,
	},
	/**
	 * To define which configuration settings should be applied
	 * based on the active profile(s).
	 *
	 * @defaultValue
	 * config.activate.onProfile (also config.activate.on-profile or CONFIG_ACTIVATE_ON-PROFILE works)
	 * Instead of config.activate.onProfile, **config.activate.on-profile or CONFIG_ACTIVATE_ON-PROFILE** can be used
	 * If this property is missing the config is configured to the default
	 *
	 * @remarks
	 * When a configuration file contains more than one configuration (e.g.) multi-document YAML,
	 * if this property is considered missing, they are considered as default profile(s)
	 */
	onProfile: {
		name: 'config.activate.onProfile',
	},
};
