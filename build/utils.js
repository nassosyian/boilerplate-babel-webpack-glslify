'use strict'
const path = require('path')
const config = require('./config')
// const extract-text-webpack-plugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const packageConfig = require('../package.json')

// const fs = require('fs');
const glob = require('glob');

exports.assetsPath = function (_path) {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory

	return path.posix.join(assetsSubDirectory, _path)
}



exports.scanFolderForTemplates = function(folderPath, extList, pluginOptions, filterFilenameFunc)
{
	var pluginList = [];
	pluginOptions = pluginOptions || {};


	for (var ext of extList)
	{
		console.log('glob search pattern: ', path.join(folderPath, '*.'+ext));
		let matches = glob.sync(path.join(folderPath, '*.'+ext), {});
		{
			for (var filename of matches )
			{
				console.log('glob found: ', filename);
				const basename = path.basename(filename, '.'+ext);
				pluginList.push( new HtmlWebpackPlugin(
					{
						hash: true,
						inject: true, // inject hashed css/js files
						...pluginOptions,
						filename: (filterFilenameFunc ? filterFilenameFunc(basename) : basename) + '.html',
						template: filename, 
					})
				)
			}
		};
	}

	pluginList.push( new HtmlWebpackPugPlugin() );

	return pluginList;
}

exports.cssLoaders = function (options) 
{
	options = options || {}

	const styleLoader = 
	{
		loader: 'style-loader',
		options: 
		{
			// url: false,
			sourceMap: options.sourceMap
		}
	}

	const cssLoader = 
	{
		loader: 'css-loader',
		options: 
		{
			url: false,
			sourceMap: options.sourceMap
		}
	}

	const postcssLoader = 
	{
		loader: 'postcss-loader',
		options: 
		{
			sourceMap: options.sourceMap
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) 
	{
		const loaders = options.usePostCSS ? [ styleLoader, MiniCssExtractPlugin.loader, cssLoader, postcssLoader] : [MiniCssExtractPlugin.loader, cssLoader]

		// loaders.push(MiniCssExtractPlugin.loader);
		if (loader) 
		{

			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, 
				{
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		// if (options.extract) 
		// {
		// 	return ExtractTextPlugin.extract({
		// 		use: loaders,
		// 		fallback: 'style-loader'
		// 	})
		// } 
		// else 
		{
			return ['style-loader'].concat(loaders)
		}
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		// less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		// stylus: generateLoaders('stylus'),
		// styl: generateLoaders('stylus')
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) 
{
	const output = []
	const loaders = exports.cssLoaders(options)

	for (const extension in loaders) 
	{
		const loader = loaders[extension]
		output.push(
		{
			test: new RegExp('\\.' + extension + '$'),
			use: loader,
			include: [ path.resolve('styles'), ]
		})
	}

	return output
}

exports.createNotifierCallback = () => 
{
	const notifier = require('node-notifier')

	return (severity, errors) => 
	{
		if (severity !== 'error') return

		const error = errors[0]
		const filename = error.file && error.file.split('!').pop()

		notifier.notify(
		{
			title: packageConfig.name,
			message: severity + ': ' + error.name,
			subtitle: filename || '',
			icon: path.join(__dirname, 'logo.png')
		})
	}
}
