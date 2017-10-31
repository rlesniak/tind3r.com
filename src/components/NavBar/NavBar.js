// @flow
import React, { Component } from 'react';
import {
  NavLink,
} from 'react-router-dom';
import { observer } from 'mobx-react';

import './NavBar.scss';

type PropsType = {
  unreadCount?: number,
  handleLogout: () => void,
  currentPerson: Object,
};

@observer
class NavBar extends Component {
  props: PropsType;

  render() {
    const { unreadCount, handleLogout, currentPerson = {} } = this.props;
    return (
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
                {!!unreadCount && <span>{unreadCount}</span>}
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
            <NavLink to={`/users/${currentPerson._id}`} activeClassName="active">
              <div className="avatar">
                {
                  currentPerson.avatarUrl &&
                  <img src={currentPerson.avatarUrl} alt="avatar" />
                }
              </div>
              <div className="name">
                {currentPerson.full_name}
              </div>
            </NavLink>
            <div className="submenu" onClick={handleLogout}>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default NavBar;
