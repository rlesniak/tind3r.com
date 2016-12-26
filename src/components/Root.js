import React from 'react'
import { Provider } from 'mobx-react'
import UserModel from '../models/User'
import ReactGA from 'react-ga'
import { browserHistory, Router, Route, IndexRedirect } from 'react-router'
import App from './App'
import Home from './Home'
import User from './User'
import Matches from './Matches'
import Actions from './Actions'
import FbConnect from './FbConnect'
import Welcome from './Welcome'
import Data from '../data'

Router.prototype.componentWillReceiveProps = function(nextProps) {
  let components = [];
  function grabComponents(element) {
    // This only works for JSX routes, adjust accordingly for plain JS config
    if (element.props && element.props.component) {
      components.push(element.props.component);
    }
    if (element.props && element.props.children) {
      React.Children.forEach(element.props.children, grabComponents);
    }
  }
  grabComponents(nextProps.routes || nextProps.children);
  components.forEach(React.createElement); // force patching
}

const clearRecsOnPageEnterOrReload = (nextState, replace, callback) => {
  Data.clearRecs().then(() => callback())
}

const isProduction = process.env.NODE_ENV == 'production'
const gaCode = isProduction ? 'UA-60241080-4' : 'UA-000000-1'

ReactGA.initialize(gaCode, {
  debug: !isProduction
});

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

const Root = () => (
  <Provider currentUser={new UserModel()}>
    <Router history={browserHistory} onUpdate={logPageView}>
      <Route path="/" component={App} onEnter={clearRecsOnPageEnterOrReload}>
        <IndexRedirect to="home" />
        <Route path="home" component={Home} />
        <Route path="users/:userId" component={User} />
        <Route path="matches" component={Matches} />
        <Route path="actions" component={Actions} />
      </Route>
      <Route path="fb-connect" component={FbConnect} />
      <Route path="welcome" component={Welcome} />
    </Router>
  </Provider>
)

export default Root
