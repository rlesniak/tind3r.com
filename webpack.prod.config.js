var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var SaveAssetsJson = require('assets-webpack-plugin');
var config = require('./webpack.config')
var packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')))

config.devtool = 'source-map'

config.output = {
  path: path.join(__dirname, 'dist'),
  pathInfo: true,
  publicPath: '/dist/',
  filename: '[name].[hash].min.js'
}

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    comments: false,
    mangle: true,
    minimize: true
  }),
  new SaveAssetsJson({
    path: process.cwd(),
    filename: 'assets.json'
  }),
]

config.plugins = config.plugins.concat(plugins)

module.exports = config
