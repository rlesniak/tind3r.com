import './Logged.scss';

import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { observable, reaction } from 'mobx';
import { observer, Provider } from 'mobx-react';

import NavBar from 'Containers/NavBar';
import Loader from 'Components/Loader';

import NotFound from '../NotFound';
import Home from './screens/Home';
import Matches from './screens/Matches';

import currentUser from 'models/CurrentUser';
import recsStore from 'stores/RecsStore';
import matchStore from 'stores/MatchStore';

@observer
class Welcome extends Component {
  @observable isLogging: boolean = true;

  constructor(props) {
    super(props);

    this.loggedHandler = reaction(
      () => currentUser._id,
      id => this.onSuccesLogin()
    );
  }

  componentDidMount() {
    currentUser.fetch();
  }

  componentWillUnmount() {
    this.loggedHandler();
  }

  onSuccesLogin() {
    recsStore.fetchCore();
    matchStore.getFromDb();

    this.isLogging = false;
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
          <NavBar />
          {this.isLogging && !currentUser.is_authenticated && <Loader />}
          {!this.isLogging && this.renderWhenLogged()}
        </div>
      </Provider>
    );
  }
}

export default Welcome;
