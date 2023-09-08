/* eslint-env node */
const config = {
	// Wordpress standards
	extends: ['stylelint-config-standard'],
	rules: {
		// Formatting - items where we'll rely on Prettier instead
		'block-closing-brace-newline-after': null,
		'block-closing-brace-newline-before': null,
		'block-opening-brace-newline-after': null,
		'block-opening-brace-space-before': null,
		'comment-empty-line-before': null,
		'declaration-bang-space-before': null,
		'declaration-block-semicolon-newline-after': null,
		'declaration-block-semicolon-space-before': null,
		'declaration-block-trailing-semicolon': null,
		'declaration-colon-newline-after': null,
		'declaration-colon-space-after': null,
		'function-comma-space-after': null,
		'max-empty-lines': null,
		'max-line-length': null,
		'media-feature-colon-space-after': null,
		'no-eol-whitespace': null,
		'no-extra-semicolons': null,
		'rule-empty-line-before': null,
		'selector-list-comma-newline-after': null,
		'selector-max-empty-lines': null,
		'string-quotes': null,
		'value-list-comma-space-after': null,
		indentation: null
	}
};
module.exports = config;
