/* eslint-disable */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const fs = require('fs');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const ab = require('express-ab');

const config = require('./webpack.config.dev.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.set('views', path.join(process.cwd(), '/server/views'));
app.set('view engine', 'ejs');

const env = {};

Object.assign(env, {
  assets: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'dist/webpack-assets.json'))),
  develop: isDeveloping,
});

app.use(cookieParser());

const myPageTest = ab.test('new-version');

app.use('/static', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/download', express.static('assets'));

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, { path: '/__webpack_hmr' }));
  app.get('*', (req, res) => {
    res.render('index', {
      env: env,
    });
  });
} else {
  app.get('*', (req, res) => {
    res.render('index', {
      env: env,
    });
  });
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
