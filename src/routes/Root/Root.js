// @flow

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Loader from 'components/Loader';

import { checkIfInstalled, getTokenDate, getFacebookToken } from 'utils/runtime';
import LS from 'utils/localStorage';

import Welcome from '../Welcome';
import Logged from '../Logged';

import '../../styles/globals.scss';

class App extends Component<{}, { isInstalled: ?boolean, isFirstLogin: boolean }> {
  state = {
    isInstalled: null,
    isFirstLogin: !LS.data.lastActivity,
  }

  componentDidMount() {
    checkIfInstalled((isInstalled) => {
      this.setState({ isInstalled });
    });
  }

  checkLogged = () => {
    getTokenDate((date) => {
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
          <Welcome handleConnect={this.handleConnect} isInstalled={isInstalled} />
        );
      }

      return (
        <Router>
          <Switch>
            <Route path="/" component={Logged} />
          </Switch>
        </Router>
      );
    } else if (isInstalled === false) {
      return (
        <Welcome handleConnect={this.handleConnect} isInstalled={isInstalled} />
      );
    }

    return <Loader />;
  }
}

export default App;
