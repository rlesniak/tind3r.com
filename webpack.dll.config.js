var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')]
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].dll.js',
    library: '[name]_lib'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '[name]-manifest.json'),
      name: '[name]_lib',
      context: path.resolve(__dirname, 'static')
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    root: path.resolve('./src'),
    modulesDirectories: ['node_modules']
  }
};
