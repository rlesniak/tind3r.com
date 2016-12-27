import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import { observer } from 'mobx-react'
import _ from 'lodash'
import styles from './nav-bar.scss'
import Data from '../data'

@observer
@CSSModules(styles)
export default class NavBar extends Component {
  render() {
    const { user, newCount } = this.props

    return (
      <div styleName="nav-bar">
        <ul>
          <li>
            <Link to="/home" activeClassName="active">
              <i className="fa fa-home"></i>
              Home
            </Link>
          </li>
          <li>
            <Link to="/matches" activeClassName="active">
              <div styleName="badge">
                <i className="fa fa-heart"></i>
                Matches
                {newCount > 0 && <span>{newCount}</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/actions" activeClassName="active">
              <i className="fa fa-history"></i>
              Actions
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
          </li>
        </ul>
      </div>
    );
  }
}
