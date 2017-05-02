import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

import NotFound from '../NotFound';

const Home = () => <h1>Home!</h1>;

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <Link to="/home">Login</Link>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/welcome" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
