import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import { observer } from 'mobx-react'
import _ from 'lodash'
import styles from './NavBar.scss'
import Data from '../../../data'
import ls from '../../../local-storage'

@observer
@CSSModules(styles)
export default class NavBar extends Component {

  @autobind
  logout() {
    const conf = confirm('Are you sure? You will lose all your history.')

    if (conf) {
      Data.purge()
      ls.clear()
      window.location.href = '/welcome'
    }
  }

  render() {
    const { user, newCount } = this.props

    if (!user) {
      return null
    }

    return (
      <div styleName="nav-bar">
        <ul>
          <li>
            <div styleName="logo">
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
              <div styleName="badge">
                <i className="fa fa-heart" />
                Matches
                {newCount > 0 && <span>{newCount}</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/history" activeClassName="active">
              <i className="fa fa-history" />
              History
            </Link>
          </li>
          <li styleName="profile">
            <Link to={`/users/${this.props.user._id}`} activeClassName="active">
              <div styleName="avatar">
                {!user.isLoading && user.photos && <img src={user.photos[0].url} alt="avatar" />}
              </div>
              <div styleName="name">
                {this.props.user.full_name}
              </div>
            </Link>
            <div styleName="submenu" onClick={this.logout}>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
