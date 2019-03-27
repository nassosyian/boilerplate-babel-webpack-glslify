module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-preset-env'),
		require('postcss-nested'),
		// require('cssnano'),
		require('postcss-cssnext')(
		{
			features: {
				rem: false, // it will not add fallback from rem to px
			},
		}),
	],
  }