const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = Object.assign(webpackConfig, {
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],

  output: Object.assign(webpackConfig.output, {
    filename: '[name].[chunkhash].v2.js',
  }),

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'dist'),
      processOutput: asset => (
        JSON.stringify([
          asset.vendor.js,
          asset.main.js,
        ])
      ),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: ['vendor.js'],
    }),
  ],
  devServer: {},
});
