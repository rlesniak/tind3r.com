import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import LogRocket from 'logrocket';

import App from './App';
import { load } from './utils/database.v2';

window.Perf = Perf;

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('cqjmsx/tind3r');
}

const rootEl = document.getElementById('root');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );

load().then(() => {
  render(App);
}).catch(err => {
  render(App);

  if (window.Bugsnag) {
    Bugsnag.notifyException(new Error('Error loading DB'), err);
  }

  alert('There is some error. Please try logout and login again');
});

if (window.Bugsnag) {
  window.Bugsnag.beforeNotify = function (data) {
    data.metaData.sessionURL = LogRocket.sessionURL;
    return data;
  };
};

if (module.hot) module.hot.accept('./App', () => render(App));
