var path = require('path');
var webpack = require('webpack');

var env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: [
    'babel-polyfill',

    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:3000',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './src/index.js',
    // the entry point of our app
  ],

  output: {
    filename: '[name].js',
    // the output bundle

    path: path.resolve(__dirname, 'dist'),

    publicPath: '/static/'
      // necessary for HMR to know where to load the hot update chunks
  },

  resolve: {
    modules: [path.resolve(__dirname, 'src/'), 'node_modules'],
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Containers: path.resolve(__dirname, 'src/containers/'),
      Utils: path.resolve(__dirname, 'src/utils/'),
      forerunnerdb: path.resolve(__dirname, 'node_modules/forerunnerdb/js/builds/all.js')
    }
  },

  devtool: 'cheap-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              includePaths: [ path.resolve(__dirname, 'src', 'styles') ]
            }
          }
        ]
      },
      {
        test: require.resolve('react-addons-perf'),
        use: 'expose-loader?Perf',
      }
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
    new webpack.ProvidePlugin({
      autobind: 'autobind-decorator',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    })
  ],

  devServer: {
    host: 'localhost',
    port: 3000,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true,
    // enable HMR on the server
  },
};
