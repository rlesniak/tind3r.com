var webpack = require('webpack');
var config = require('./webpack.config')

config.devtool = '#cheap-module-eval-source-map';
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

config.entry.bundle = [
  'react-hot-loader/patch',
  'webpack-hot-middleware/client'
].concat(config.entry.bundle)

module.exports = config
