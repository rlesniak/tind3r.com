import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import App from './App';
import { load } from './utils/database.v2';

window.Perf = Perf;

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
});

if (module.hot) module.hot.accept('./App', () => render(App));
