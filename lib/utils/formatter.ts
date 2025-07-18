/**
 * Convert a given string into camel case. Equivalent to .camelCase() from lodash
 *
 * @param word Word to camelize
 * @param delimiter Delimiter that separates text in the word. Defaults to hyphen ('-').
 *
 * @remarks
 * .camelCase() from lodash converts the string differently. (e.g.) a-b2c-d is converted to aB2CD.
 * But this function converts a-b2c-d to aB2cD which is desired for this library
 *
 * @internal
 */
export const camelCase = (word: string): string =>
	word
		.split('-')
		.map((segment, index) => (index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()))
		.join('');
