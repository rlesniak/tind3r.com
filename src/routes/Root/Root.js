import '../../styles/globals.scss';

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';

import NavBar from 'Containers/NavBar';

import Welcome from '../Welcome';
import Logged from '../Logged';
import NotFound from '../NotFound';

import { checkIfInstalled } from '../../utils/runtime';

class App extends Component {
  state = {
    isInstalled: null,
  }

  componentDidMount() {
    checkIfInstalled((isInstalled) => {
      this.setState({ isInstalled });
    });
  }

  render() {
    const { isInstalled } = this.state;

    if (isInstalled) {
      return (
        <Router>
          <div>
            <Switch>
              <Route path="/welcome" component={Welcome} />
              <Route path="/" component={Logged} />
            </Switch>
          </div>
        </Router>
      );
    } else if (isInstalled === false) {
      return (
        <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/welcome" component={Welcome} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      );
    }

    return <h1>Spinner</h1>;
  }
}

export default App;
