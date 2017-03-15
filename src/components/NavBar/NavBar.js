// @flow

import './NavBar.scss';

import React from 'react';
import {
  Link,
} from 'react-router-dom';

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
        <Link to="/home" activeClassName="active">
          <i className="fa fa-home" />
          Home
        </Link>
      </li>
      <li>
        <Link to="/matches" activeClassName="active">
          <div className="badge">
            <i className="fa fa-heart" />
            Matches
            {!!unreadCount && <span>{unreadCount}</span>}
          </div>
        </Link>
      </li>
      <li>
        <Link to="/history" activeClassName="active">
          <i className="fa fa-history" />
          History
        </Link>
      </li>
      <li>
        <Link to="/profile-edit" activeClassName="active">
          <i className="fa fa-cog" />
          Profile edit
        </Link>
      </li>
      <li>
        <Link to="/discussion" activeClassName="active">
          <i className="fa fa-comments-o" />
          Discussion
        </Link>
      </li>
      <li className="profile">
        <Link to={`/users/${currentPerson._id}`} activeClassName="active">
          <div className="avatar">
            {
              !currentPerson.isLoading && currentPerson.photos &&
              <img src={currentPerson.photos[0].url} alt="avatar" />
            }
          </div>
          <div className="name">
            {currentPerson.full_name}
          </div>
        </Link>
        <div className="submenu" onClick={handleLogout}>
          <span>Logout</span>
        </div>
      </li>
    </ul>
  </div>
);

export default NavBar;
