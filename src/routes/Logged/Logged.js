import './Logged.scss';

import React, { Component } from 'react';
import { Route, Link, Switch, NavLink } from 'react-router-dom';
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

    window.ms = matchStore;
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
          <div className="nav-bar">
            <ul>
              <li>
                <div className="logo">
                  <div className="logo-m-white" />
                </div>
              </li>
              <li>
                <NavLink to="/home" activeClassName="active">
                  <i className="fa fa-home" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/matches" activeClassName="active">
                  <div className="badge">
                    <i className="fa fa-heart" />
                    Matches
                    {!!matchStore.unreadCount && <span>{matchStore.unreadCount}</span>}
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to="/history" activeClassName="active">
                  <i className="fa fa-history" />
                  History
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile-edit" activeClassName="active">
                  <i className="fa fa-cog" />
                  Profile edit
                </NavLink>
              </li>
              <li>
                <NavLink to="/discussion" activeClassName="active">
                  <i className="fa fa-comments-o" />
                  Discussion
                </NavLink>
              </li>
              <li className="profile">
                <NavLink to={`/users/${currentUser._id}`} activeClassName="active">
                  <div className="avatar">
                    {
                      currentUser.avatarUrl &&
                      <img src={currentUser.avatarUrl} alt="avatar" />
                    }
                  </div>
                  <div className="name">
                    {currentUser.full_name}
                  </div>
                </NavLink>
                <div className="submenu" onClick={this.handleLogout}>
                  <span>Logout</span>
                </div>
              </li>
            </ul>
          </div>
          {currentUser.is_fetching && !currentUser.is_authenticated && <Loader />}
          {!currentUser.is_fetching && this.renderWhenLogged()}
        </div>
      </Provider>
    );
  }
}

export default Welcome;
