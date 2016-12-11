import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'
import './styles/main.scss'

ReactDOM.render(<AppContainer><Root /></AppContainer>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./components/Root').default;
    ReactDOM.render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
