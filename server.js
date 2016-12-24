var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3001

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: false,
    stats: {
      colors: true
    },
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use('/dist', express.static('dist'))

app.get('*', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
  }
});
