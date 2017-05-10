import React, { Component } from 'react';
import ReactGA from 'react-ga';

import Root from './routes/Root';

const gaCode = process.env.NODE_ENV === 'production' ? 'UA-60241080-4' : 'UA-000000-1';

ReactGA.initialize(gaCode, {
  debug: false,
});

ReactGA.set({ dimension1: '2.0' });

export default class App extends Component {
  render() {
    return (
      <Root />
    );
  }
}
