import '../../styles/globals.scss';

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Loader from 'components/Loader';
import Login from 'components/Login';

import { checkIfInstalled, getTokenDate, getFacebookToken } from 'utils/runtime';
import LS from 'utils/localStorage';

import Welcome from '../Welcome';
import Logged from '../Logged';
import NotFound from '../NotFound';


class App extends Component {
  state = {
    isInstalled: null,
    isFirstLogin: !LS.data.lastActivity,
  }

  componentDidMount() {
    checkIfInstalled(isInstalled => {
      this.setState({ isInstalled });
    });
  }

  checkLogged = () => {
    getTokenDate(date => {
      if (date) {
        window.onfocus = n => n;
        this.setState({ isFirstLogin: false });
      }
    });
  }

  handleConnect = () => {
    getFacebookToken();

    window.onfocus = this.checkLogged;
  }

  render() {
    const { isInstalled, isFirstLogin } = this.state;

    if (isInstalled) {
      if (isFirstLogin) {
        return (
          <div>
            <Login onClick={this.handleConnect} />
          </div>
        );
      }

      return (
        <Router>
          <Switch>
            <Route path="/welcome" component={Welcome} />
            <Route path="/" component={Logged} />
          </Switch>
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

    return <Loader />;
  }
}

export default App;
