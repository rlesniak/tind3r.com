var path = require('path');
var webpack = require('webpack');
var RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, 'static'),
      manifest: require('./vendor-manifest.json')
    }),
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
      version: '0.0.2',
      publicPath: 'http://tnder.herokuapp.com/'
    })
  ],
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass'
        ]
      }
    ]
  }
};
