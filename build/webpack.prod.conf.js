'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const env = require('../config/prod.env')

const html_options = {
	// hash: true,
	inject: true, // inject hashed css/js files
	minify: 
	{
		removeComments: true,
		collapseWhitespace: false,
		conservativeCollapse: true,
		preserveLineBreaks: true,
		useShortDoctype: true,
		html5: true,
		removeAttributeQuotes: true
		// more options:
		// https://github.com/kangax/html-minifier#options-quick-reference
	},
	mobile: true,
	// necessary to consistently work with multiple chunks via CommonsChunkPlugin
	chunksSortMode: 'dependency'
};

const webpackConfig = merge(baseWebpackConfig, 
{
	mode: 'production',
	module: 
	{
		rules: utils.styleLoaders(
		{
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: 
	{
		path: config.build.destRoot,
		// filename: ('js/[name].[chunkhash].js'),
		// chunkFilename: ('js/[name].[id].[chunkhash].js')
		filename: ('js/[name].[contenthash:8].js'),
		chunkFilename: ('js/[name].[id].[contenthash:8].js')
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin(
		{
			'process.env': env
		}),

		// extract css into its own file
		// new ExtractTextPlugin({
		// 	filename: utils.assetsPath('css/[name].[hash].css'),
		// 	// Setting the following option to `false` will not extract CSS from codesplit chunks.
		// 	// Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
		// 	// It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
		// 	// increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
		// 	allChunks: true,
		// }),
		new MiniCssExtractPlugin(
		{
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: utils.assetsPath('css/[name].[hash].css'),
			// filename: utils.assetsPath('css/styles.css'),
			// chunkFilename: "[id].css"
		}),

		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin(
		{
			// filename: config.build.index,
			filename: path.resolve(__dirname, '../dist/index.html'),
			// template: 'index.html',
			template: path.resolve(__dirname, '../pages/index.pug'),
			...html_options
		}),
		new HtmlWebpackPugPlugin(),
		// new PreloadWebpackPlugin(), // needs to be updated to suppert Webpack 4
		// new InlineManifestWebpackPlugin(), 
		// keep module.id stable when vendor modules does not change
		new webpack.HashedModuleIdsPlugin(),
		// enable scope hoisting
		new webpack.optimize.ModuleConcatenationPlugin(),

		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.build.assetsSubDirectory,
				ignore: ['.*']
			}
		])
	],
	optimization: 
	{
		runtimeChunk: { name: 'runtime' },
		splitChunks: {
			automaticNameDelimiter: '--',
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: 
			{
				vendor: 
				{
					test: /[\\/]node_modules[\\/]/,
					name(module) 
					{
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
			
						// npm package names are URL-safe, but some servers don't like @ symbols
						// return `vendor.${packageName.replace('@', '')}.bundle`;
						return `vendor.${packageName.trim().replace(/[@;\/,]/gi, '')}.bundle`;
					},
					enforce: true,
					chunks: 'all'
				},
			},
		},
		minimizer: [
			new TerserPlugin({
				sourceMap: config.build.productionSourceMap,
				parallel: true,
				cache: './.build_cache/terser',
				// exclude: /libs/,
				terserOptions: {
					warnings: false,
					ie8: false,
					safari10: true,
					mangle: true
				},
			}),
		]
	}
})

if (config.build.productionGzip) 
{
	const CompressionWebpackPlugin = require('compression-webpack-plugin')

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin(
		{
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) 
{
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
