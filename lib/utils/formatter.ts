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
		.split('_')
		.map((segment) => {
			if (segment.includes('.')) {
				return segment;
			}

			return segment
				.toLowerCase()
				.split('-') // convert dashes into camelCase boundaries
				.map((word, index) =>
					index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
				)
				.join('');
		})
		.join('.');
