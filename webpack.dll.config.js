var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]_lib'
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '[name]-manifest.json'),
      name: '[name]_lib',
      context: path.resolve(__dirname, 'dist')
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   comments: false,
    //   mangle: true,
    //   minimize: true
    // })
  ],
  resolve: {
    root: path.resolve('./src'),
    modulesDirectories: ['node_modules']
  }
};
