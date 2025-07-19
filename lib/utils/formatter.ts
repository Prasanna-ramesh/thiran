/**
 * Convert a given string into camel case. Equivalent to .camelCase() from lodash
 *
 * @param text Test to camelize
 *
 * @remarks
 * .camelCase() from lodash converts the string differently. (e.g.) a-b2c-d is converted to aB2CD.
 * But this function converts a-b2c-d to aB2cD which is desired for this library
 *
 * @internal
 */
export const camelCase = (text: string): string =>
	text
		.split('-')
		.map((segment, index) => (index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()))
		.join('');
