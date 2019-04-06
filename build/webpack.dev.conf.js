'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, 
{
	mode: 'development',
	module: 
	{
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
	},
	// cheap-module-eval-source-map is faster for development
	devtool: config.dev.devtool,

	// these devServer options should be customized in /config/index.js
	devServer: 
	{
		clientLogLevel: 'warning',
		historyApiFallback: 
		{
			rewrites: [
				// { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
			],
		},
		headers: 
		{
			'Access-Control-Allow-Origin': '*'
		},
		hot: true,
		// if we disable it, misc files (media/scripts) will not be served
		// contentBase: false, // since we use CopyWebpackPlugin.
		compress: true,
		host: HOST || config.dev.host,
		port: PORT || config.dev.port,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay
			? { warnings: false, errors: true }
			: false,
		publicPath: config.dev.assetsPublicPath,
		// publicPath: '../', 
		proxy: config.dev.proxyTable,
		// quiet: false, 
		quiet: true, // necessary for FriendlyErrorsPlugin
		watchOptions: 
		{
			poll: config.dev.poll,
		}
	},
	plugins: [
		new webpack.DefinePlugin(
		{
			'process.env': require('../config/dev.env')
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
		new webpack.NoEmitOnErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin(
		{
			filename: 'index.html',
			template: path.resolve(__dirname, '../pages/index.pug'),
			// filetype: 'pug',
			hash: true,
			inject: true // inject hashed css/js files
		}),
		new HtmlWebpackPugPlugin(),
		new MiniCssExtractPlugin(
		{
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: utils.assetsPath('css/[name].[hash].css'),
			// filename: utils.assetsPath('css/styles.css'),
			// chunkFilename: "[id].css"
		}),
		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.dev.assetsSubDirectory + '/static',
				ignore: ['.*']
			},
			{
				from: path.resolve(__dirname, '../assets'),
				to: config.dev.assetsSubDirectory + '/assets',
				ignore: ['.*']
			},
			{
				from: path.resolve(__dirname, '../media'),
				to: config.dev.assetsSubDirectory + '/media',
				ignore: ['.*']
			}
		])
	]
})

module.exports = new Promise((resolve, reject) => 
{
	portfinder.basePort = process.env.PORT || config.dev.port
	portfinder.getPort((err, port) => 
	{
		if (err) 
		{
			reject(err)
		} 
		else 
		{
			// publish the new Port, necessary for e2e tests
			process.env.PORT = port
			// add port to devServer config
			devWebpackConfig.devServer.port = port

			// Add FriendlyErrorsPlugin
			devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
				compilationSuccessInfo: 
				{
					messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
				},
				onErrors: config.dev.notifyOnErrors
				? utils.createNotifierCallback()
				: undefined
			}))

			resolve(devWebpackConfig)
		}
	})
})
