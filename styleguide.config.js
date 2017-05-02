const path = require('path');

module.exports = {
  title: 'My Great Style Guide',
  components: './src/components/**/*.js',
  updateWebpackConfig(webpackConfig) {
    // Your source files folder or array of folders, should not include node_modules
    const dir = path.join(__dirname, 'src');
    webpackConfig.module.loaders.push(
      // Babel loader will use your project’s .babelrc
      {
        test: /\.jsx?$/,
        include: dir,
        loader: 'babel'
      },
      // Other loaders that are needed for your components
      {
        test: /\.scss$/,
        include: [dir, path.join(__dirname, 'styleguide')],
        loaders: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, './src/styles')]
            }
          }
        ]
      }
    );

    webpackConfig.entry.push(path.join(__dirname, 'styleguide/style.scss'));

    webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias, {
      components: path.resolve(__dirname, 'src/components/'),
      Containers: path.resolve(__dirname, 'src/containers/'),
      Utils: path.resolve(__dirname, 'src/utils/')
    });

    return webpackConfig;
  },
  template: './stylegiude.template.html',
  skipcomponentsWithoutExample: true
};
