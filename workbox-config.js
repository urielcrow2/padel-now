module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,jpg,png,ico,html,txt,css,js}'
	],
	swDest: 'build/sw.js',
	/*ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],*/
	swSrc: 'src/sw-template.js'
};