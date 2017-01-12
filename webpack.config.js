var path = require('path');
var webpack = require('webpack');

var env = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    bundle: [
      'babel-polyfill',
      './src/index'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, 'dist'),
      manifest: require('./vendor-manifest.json')
    }),
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
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass?sourceMap'
        ]
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader',
        options: {
          name: '[path][name].[hash].[ext]'
        }
      },
      {
        test: /\.(ogg|mp3)$/,
        include: path.join(__dirname, 'src', 'static'),
        loader: 'file-loader'
      }
    ]
  }
};
