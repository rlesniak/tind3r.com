import './Logged.scss';

import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { observable, reaction } from 'mobx';
import { observer, Provider } from 'mobx-react';

import NavBar from 'Components/NavBar';
import Loader from 'Components/Loader';

import NotFound from '../NotFound';
import Home from './screens/Home';
import Matches from './screens/Matches';

import currentUser from 'models/CurrentUser';
import recsStore from 'stores/RecsStore';
import matchStore from 'stores/MatchStore';

@observer
class Welcome extends Component {
  loggedHandler: () => void;

  @observable isLogging: boolean = true;

  constructor() {
    super();

    this.loggedHandler = reaction(
      () => ({ id: currentUser._id, isAuthenticated: currentUser.is_authenticated }),
      ({ isAuthenticated }) => {
        if (isAuthenticated) {
          this.onSuccesLogin()
        } else {
          this.onErrorLogin()
        }
      }
    );
  }

  componentDidMount() {
    currentUser.fetch();
  }

  componentWillUnmount() {
    this.loggedHandler();
  }

  onErrorLogin() {
    console.log('error')
  }

  onSuccesLogin() {
    recsStore.fetchCore();
    // matchStore.fetch();
    matchStore.getFromDb();
  }

  renderWhenLogged() {
    return (
      currentUser.is_authenticated ? (
        <div className="logged">
          <Switch>
            <Route exact path="/" render={() => <Home recsStore={recsStore} />} />
            <Route exact path="/home" render={() => <Home recsStore={recsStore} />} />
            <Route path="/matches" component={Matches} />
            <Route component={NotFound} />
          </Switch>
        </div>
      ) : (
        <div className="not-logged">
          <h1>Your Tinder session has expired or first visit. <br />Refresh it here:</h1>
          <button className="button blue" onClick={this.connect}>Refresh</button>
        </div>
      )
    )
  }

  render() {
    return (
      <Provider currentUser={currentUser} matchStore={matchStore}>
        <div>
          <NavBar
            unreadCount={matchStore.unreadCount}
            currentPerson={currentUser}
          />
          {currentUser.is_fetching && !currentUser.is_authenticated && <Loader />}
          {!currentUser.is_fetching && this.renderWhenLogged()}
        </div>
      </Provider>
    );
  }
}

export default Welcome;
