// @flow

import './Logged.scss';

import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import { observable, reaction } from 'mobx';
import { observer, Provider } from 'mobx-react';
import ReactTooltip from 'react-tooltip';

import Loader from 'components/Loader';
import Avatar from 'components/Avatar';
import PersonModal from 'components/PersonModal';

import NotFound from '../NotFound';
import Home from './screens/Home';
import Matches from './screens/Matches';
import Person from './screens/Person';

import currentUser from 'models/CurrentUser';
import recsStore from 'stores/RecsStore';
import matchStore from 'stores/MatchStore';

type PropsType = {
  location: Object,
  history: Object,
};

@observer
class Welcome extends Component {
  props: PropsType;

  loggedHandler: () => void;
  previousLocation: Object;

  @observable isModalVisible: boolean = false;

  constructor(props: PropsType) {
    super(props);
    this.previousLocation = props.location;

    this.loggedHandler = reaction(
      () => ({ id: currentUser._id, isAuthenticated: currentUser.is_authenticated }),
      ({ isAuthenticated }) => {
        if (isAuthenticated === true) {
          this.onSuccesLogin();
        } else if (isAuthenticated === false) {
          this.onErrorLogin();
        }
      },
    );
  }

  componentDidMount() {
    currentUser.fetch();
  }

  componentWillUpdate(nextProps: PropsType) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  componentWillUnmount() {
    this.loggedHandler();
  }

  onErrorLogin() {
    console.log('error');
  }

  onSuccesLogin() {
    // matchStore.fetch();
    matchStore.getFromDb();
    matchStore.setCurrentUserId(currentUser._id);

    window.ms = matchStore;
  }

  renderWhenLogged() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    );

    return (
      currentUser.is_authenticated ? (
        <div className="logged">
          <Switch location={isModal ? this.previousLocation : location}>
            <Route exact path="/" render={() => <Home recsStore={recsStore} />} />
            <Route exact path="/home" render={() => <Home recsStore={recsStore} />} />
            <Route path="/matches" component={Matches} />
            <Route path="/user/:id" component={Person} />
            <Route component={NotFound} />
          </Switch>

          {isModal ? <Route path="/user/:id" component={PersonModal} /> : null}
        </div>
      ) : (
        <div className="not-logged">
          <h1>Your Tinder session has expired or first visit. <br />Refresh it here:</h1>
          <button className="button blue" onClick={this.connect}>Refresh</button>
        </div>
      )
    );
  }

  render() {
    return (
      <Provider currentUser={currentUser} matchStore={matchStore}>
        <div className="logged">
          <ReactTooltip id="main" place="top" effect="solid" />
          <div className="logged__nav-bar">
            <ul>
              <li>
                <div className="logo">
                  <div className="logo-m-white" />
                </div>
              </li>
              <li>
                <NavLink to="/home" activeClassName="active">
                  <i className="fa fa-home" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/matches" activeClassName="active">
                  <div className="badge">
                    <i className="fa fa-heart" />
                    <span>Matches
                      {!!matchStore.unreadCount && <span>{matchStore.unreadCount}</span>}
                    </span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to="/history" activeClassName="active">
                  <i className="fa fa-history" />
                  <span>History</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile-edit" activeClassName="active">
                  <i className="fa fa-cog" />
                  <span>Profile edit</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/discussion" activeClassName="active">
                  <i className="fa fa-comments-o" />
                  <span>Discussion</span>
                </NavLink>
              </li>
              <li className="separator" />
              <li className="profile">
                <NavLink to={`/users/${currentUser._id}`} activeClassName="active">
                  {currentUser.avatarUrl && <Avatar url={currentUser.avatarUrl} />}
                  <div className="name">
                    {currentUser.name}
                  </div>
                </NavLink>
              </li>
              <li>
                <div
                  className="logout"
                  onClick={this.handleLogout}
                  data-tip="Logout"
                  data-for="main"
                >
                  <i className="fa fa-sign-out" />
                </div>
              </li>
            </ul>
          </div>
          <div className="logged__content">
            {currentUser.is_fetching && !currentUser.is_authenticated && <Loader />}
            {!currentUser.is_fetching && this.renderWhenLogged()}
          </div>
        </div>
      </Provider>
    );
  }
}

export default Welcome;
