import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf'
import App from './App';
import { load } from './utils/database.v2';

window.Perf = Perf;

load().then(() => {
  render(App);
});

const rootEl = document.getElementById('root');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

if (module.hot) module.hot.accept('./App', () => render(App));
