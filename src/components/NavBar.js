import React, { Component } from 'react';
import { observable } from 'mobx'
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
  @observable newItems = 0

  constructor(props) {
    super(props)

    this.countUnread()
    this.registerHook()
  }

  registerHook() {
    Data.registerMatchesHook(() => {
      this.newItems -= 1
    }, 'updating')

    Data.registerMatchesHook(() => {
      this.newItems += 1
    })
  }

  countUnread() {
    Data.matches().where('isNew').equals(1).count(c => {
      this.newItems = c
    })
  }

  render() {
    const { user } = this.props

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
                {this.newItems > 0 && <span>{this.newItems}</span>}
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
            <a href>
              <div styleName="avatar">
                {!user.isLoading && <img src={user.photos[0].url} alt="avatar" />}
              </div>
              <div styleName="name">
                {this.props.user.full_name}
              </div>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
