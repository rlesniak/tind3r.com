import './Logged.scss';

import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, Provider } from 'mobx-react';

import NavBar from 'Containers/NavBar';
import Loader from 'Components/Loader';

import NotFound from '../NotFound';
import Home from './screens/Home';
import Matches from './screens/Matches';

import currentUser from 'models/CurrentUser';
import recsStore from 'stores/RecsStore';

import { meta } from 'services/fetch-service';

@observer
class Welcome extends Component {
  @observable isLogged: boolean = false;
  @observable isLogging: boolean = true;

  componentDidMount() {
    meta().then(data => {
      recsStore.fetchCore();
      console.log(data);

      currentUser.set(data);

      this.isLogged = true;
      this.isLogging = false;
    }).catch(err => {
      this.isLogged = false;
      this.isLogging = false;
    })
  }

  renderWhenLogged() {
    return (
      this.isLogged ? (
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
      <Provider currentUser={currentUser}>
        <div>
          <NavBar />
          {this.isLogging && !this.isLogged && <Loader />}
          {!this.isLogging && this.renderWhenLogged()}
        </div>
      </Provider>
    );
  }
}

export default Welcome;
