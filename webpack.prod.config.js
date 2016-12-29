var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')
var SaveAssetsJson = require('assets-webpack-plugin');
var config = require('./webpack.config')
var packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')))
var commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString().trim();

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
  new RollbarSourceMapPlugin({
    accessToken: '569f2db30e904dc19367cdeeffd07e1f',
    version: commitHash,
    publicPath: 'http://tnder.herokuapp.com/'
  }),
  new SaveAssetsJson({
    path: process.cwd(),
    filename: 'assets.json'
  }),
]

config.plugins = config.plugins.concat(plugins)

module.exports = config
