import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Loader from 'components/Loader';

import { checkIfInstalled, getTokenDate, getFacebookToken, checkVersion } from 'utils/runtime';
import LS from 'utils/localStorage';

import Welcome from '../Welcome';
import Logged from '../Logged';

import '../../styles/globals.scss';

class App extends Component {
  state = {
    isInstalled: null,
    isOutdated: false,
    isFirstLogin: !LS.data.lastActivity,
  }

  componentDidMount() {
    checkIfInstalled((isInstalled) => {
      this.setState({ isInstalled });

      if (!isInstalled) {
        return;
      }

      checkVersion((ver) => {
        if (ver !== '0.3.0') {
          this.setState({
            isOutdated: true,
          });
        }
      });
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
    const { isInstalled, isFirstLogin, isOutdated } = this.state;
    if (isInstalled && !isOutdated) {
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
    } else if (isOutdated) {
      return (
        <Welcome handleConnect={this.handleConnect} isOutdated={isOutdated} isInstalled={isInstalled} />
      );
    }

    return <Loader />;
  }
}

export default App;
