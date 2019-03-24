# boilerplate-babel-webpack

[![npm version](https://badge.fury.io/js/boilerplate-babel-webpack-glslify.svg)](https://badge.fury.io/js/boilerplate-babel-webpack-glslify)
[![downloads count](https://img.shields.io/npm/dt/boilerplate-babel-webpack.svg)](https://www.npmjs.com/~nassosyian)
[![dependencies](https://david-dm.org/nassosyian/boilerplate-babel-webpack-glslify.svg)](https://github.com/nassosyian/boilerplate-babel-webpack-glslify)

:fork_and_knife: Starter with Babel.js and Webpack

this was originally a fork of https://github.com/piecioshka/boilerplate-babel-webpack

## Features

* :white_check_mark: Webpack v4.29.6
* :white_check_mark: Babel v7.3.4
* :white_check_mark: Support syntax ES2015 & ES2016 & ES2017 & ES2018
* :white_check_mark: Static directory: `static/`
* :white_check_mark: Source Map of bundle file.
* :white_check_mark: Analysis of bundle file weight.

## Getting started

You can start in two ways:

### Use Git

```bash
mkdir PROJECT_NAME
cd $_     # Note: "$_" is last argument of previous command
git init  # Note: branch "master" is created
git remote add boilerplate git@github.com:nassosyian/boilerplate-babel-webpack-glslify.git
git pull boilerplate master
git remote remove boilerplate
```

## How to build the application?

```bash
npm install
npm run build
```

Your source will be minified.

## How to develop the application?

```bash
npm install
npm run dev
```

## Remove generated directory

If you would like to remove `dist/` directory (created by Webpack):

```bash
npm run clear
```

If you would like to remove `node_modules/` and remove `dist/`

```bash
npm run clear:all
```

## Count LOC (Lines of Code)

If you would like to know how many lines of code you write:

```bash
npm run count
```

## Analysis of bundle file weight

If you would like to check how much a bundle file weight:

```bash
npm run audit
```

## License

[The MIT License](http://nassosyian.mit-license.org) @ 2017
