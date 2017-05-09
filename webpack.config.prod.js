const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev');
const AssetsPlugin = require('assets-webpack-plugin');

webpackConfig.module.rules[1].use = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  {
    loader: 'sass-loader',
    options: { includePaths: [path.resolve(__dirname, 'src', 'styles')] },
  },
];

module.exports = Object.assign(webpackConfig, {
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],

  output: Object.assign(webpackConfig.output, {
    filename: '[name].[chunkhash].v2.js',
  }),
  devtool: 'source-map',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
      mangle: false,
      sourceMap: true,
      output: {
        comments: false,
      },
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
  ],
  devServer: {},
});
