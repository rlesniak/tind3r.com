import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import LogRocket from 'logrocket';

import App from './App';
import { load } from './utils/database.v2';

const rootEl = document.getElementById('root');
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );
};

if (window.chrome && !window.chrome.runtime) {
  window.location.href = 'https://tind3r.com';
}

load().then(() => {
  render(App);
});

if (module.hot) module.hot.accept('./App', () => render(App));
