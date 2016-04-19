var path = require('path');
var webpack = require('webpack');

module.exports = {
	  entry: './dev/es6/index.js',
	  output: { path: './static/js/', filename: 'index.js' },
	  module: {
		    loaders: [
		{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react']
			}
		}
		]
	},
};
