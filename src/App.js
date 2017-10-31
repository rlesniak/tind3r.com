import React from 'react';
import ReactGA from 'react-ga';
import DocumentTitle from 'react-document-title';

import Root from './routes/Root';

const gaCode = process.env.NODE_ENV === 'production' ? 'UA-60241080-4' : 'UA-000000-1';

ReactGA.initialize(gaCode, {
  debug: false,
});

ReactGA.set({ dimension1: '2.0' });

export default () => (
  <DocumentTitle title="Tinder">
    <Root />
  </DocumentTitle>
);
