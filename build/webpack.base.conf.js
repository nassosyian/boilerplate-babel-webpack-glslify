'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('./config')
const webpack = require('webpack');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const WebpackPugManifestPlugin = require('webpack-pug-manifest-plugin');
// const pugManifest = new WebpackPugManifestPlugin();



function resolve (dir) 
{
	return path.join(__dirname, '..', dir)
}

const createLintingRule = () => (
{
	test: /\.(js|vue)$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	include: [resolve('src'), resolve('test')],
	options: 
	{
		formatter: require('eslint-friendly-formatter'),
		emitWarning: !config.dev.showEslintErrorsInOverlay
	}
})

module.exports = 
{
	context: path.resolve(__dirname, '../'),
	entry: 
	{
		main: './src/index.js'
	},
	output: 
	{
		path: config.build.destRoot,
		filename: '[name].[hash:8].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: 
	{
		extensions: ['.js', '.vue', '.json', '.sass', '.scss'],
		alias: 
		{
			'@': resolve('src'),
			'views': path.resolve(__dirname, '../src/views'),
			// 'styles': path.resolve(__dirname, '../styles'),
			'shaders': path.resolve(__dirname, '../src/shaders'),
			'fonts': path.resolve(__dirname, '../assets/fonts')
		}
	},
	plugins: [
		// new webpack.ProvidePlugin({
		// 	'THREE': 'three'
		// }),
		new SVGSpritemapPlugin('media/svg/**/*.svg', 
			{
				output: {
					filename: utils.assetsPath('svg/spritemap.svg')
				}
			}
		),
		// new WebpackPugManifestPlugin(),
	],
	module: 
	{
		rules: [
			...(config.dev.useEslint ? [createLintingRule()] : []),
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: 
				{
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: 
				{
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: 
				{
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			// { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
			// { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ },
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					// 'glslify-loader'
					{
						loader: 'glslify-loader',
						options: {
							transform: [
								['glslify-hex', { }]
							]
						}
					}
				]
			},
			{
				test: /\.pug$/,
				// loader: 'pug-loader',
				loader: ['html-loader?attrs=false', 'pug-html-loader'],
				include: [ resolve('pages'), resolve('partials'), resolve('templates'), resolve('data'), ],
				// options: {
				// 	// attrs: false,
				// 	exports: false,
				// 	pretty: process.env.NODE_ENV === 'production' ? false : true,
				// 	data: {

				// 	}
				// }
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
		]
	},
	node: 
	{
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		// setImmediate: false,

		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
}
