// @flow

import './NavBar.scss';

import React from 'react';
import {
  NavLink,
} from 'react-router-dom';
import { observer } from 'mobx-react';

type PropsType = {
  unreadCount?: number,
  handleLogout: () => void,
  currentPerson: Object,
};

const NavBar = ({ unreadCount, handleLogout, currentPerson = {} }: PropsType) => (
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
              currentPerson.is_fetched && currentPerson.photos &&
              <img src={currentPerson.photos.url} alt="avatar" />
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

export default observer(NavBar);
