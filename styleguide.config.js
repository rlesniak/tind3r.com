const path = require('path');

module.exports = {
  title: 'My Great Style Guide',
  components: './src/components/ActionButtons/ActionButtons.js',
  webpackConfig: require('./webpack.config.js'),
  template: './stylegiude.template.html',
  skipComponentsWithoutExample: true
};
