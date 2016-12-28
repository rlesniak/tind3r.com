import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import { browserHistory } from 'react-router'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import UserStore from '../../stores/UserStore'
import styles from './app.scss'
import NavBar from '../NavBar'
import User from '../../models/User'
import Data from '../../data'
import { checkIfInstalled } from '../../runtime'

@inject('currentUser')
@observer
@CSSModules(styles)
export default class App extends Component {
  @observable newCount = 0

  constructor(props) {
    super(props)

    this.userStore = new UserStore()

    this.checkIfHasExtension(() => {
      this.props.currentUser.fetchMeta().then(() => {
        this.userStore.core()
        this.afterSucessLogin()
      }).catch(status => {
        browserHistory.push('/fb-connect')
      })
    })
  }

  afterSucessLogin() {
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        Data.updates()
      }, 3000)
    }

    this.countUnread()
    this.registerHook()
  }

  checkIfHasExtension(successCallback) {
    checkIfInstalled(status => {
      if (!status) {
        window.location = '/welcome'
      } else {
        successCallback()
      }
    })
  }

  registerHook() {
    Data.registerMatchesHook(() => {
      setTimeout(() => this.countUnread(), 0) // TODO: remove timeout
    }, 'updating')

    Data.registerMatchesHook(() => {
      this.countUnread()
    })
  }

  countUnread() {
    Data.db().matches.where('isNew').equals(1).count(c => {
      this.newCount = c
    })
  }

  render() {
    return (
      <div styleName="page">
        <NavBar user={this.props.currentUser} newCount={this.newCount} />
        {this.props.children && React.cloneElement(this.props.children, {
          userStore: this.userStore,
          currentUser: this.props.currentUser,
        })}
      </div>
    );
  }
}
