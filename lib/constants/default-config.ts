import type { ConfigProperties } from '../types';

export const DEFAULT_PROFILE_NAME = 'default';

export const defaultConfigProperties: ConfigProperties = {
	/**
	 * Base location where default and additional configuration files can be found
	 *
	 * @defaultValue
	 * config.baseLocation = ./config (also config.base-location works)
	 */
	baseLocation: {
		name: 'config.baseLocation',
		defaultValue: './config',
	},
	/**
	 * Location of the base config file
	 *
	 * @defaultValue
	 * config.location = application.yaml
	 */
	defaultConfigurationFile: {
		name: 'config.location',
		defaultValue: 'application.yaml',
	},
	/**
	 * Additional configuration file(s).
	 * Incase of multiple files, separate them with commas
	 *
	 * @defaultValue
	 * config.additionalLocation (also config.additional-location works)
	 *
	 * @example
	 * config.additionalLocation = application-dev.yaml,application-tenant.yaml
	 */
	additionalConfigurationFiles: {
		name: 'config.additionalLocation',
	},
	/**
	 * Currently active profile(s). Should be set through env variable.
	 * Incase of multiple profiles, separate profile with comma
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
	 * config.activate.onProfile (also config.activate.on-profile works)
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
