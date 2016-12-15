import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import App from './App'
import Home from './Home'
import User from './User'
import FbConnect from './FbConnect'
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

const Root = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} onEnter={clearRecsOnPageEnterOrReload}>
      <IndexRoute component={Home} />
      <Route path="users/:userId" component={User} />
      <Route path="fb-connect" component={FbConnect} />
    </Route>
  </Router>
)

export default Root
