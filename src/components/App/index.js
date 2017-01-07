import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import { browserHistory } from 'react-router'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import MatchAlert from '../MatchAlert'
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
      this.props.currentUser.fetchMeta().then(resp => {
        if (resp.rating.super_likes.resets_at) {
          localStorage.setItem('superLikeExpiration', resp.rating.super_likes.resets_at)
        }

        this.userStore.core()
        this.afterSucessLogin()
      }).catch(status => {
        browserHistory.push('/fb-connect')
      })
    })
  }

  afterSucessLogin() {
    if (process.env.NODE_ENV === 'production') {
    // if (1) {
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
      setTimeout(() => this.countUnread(), 0) // TODO: remove timeout
    })
  }

  countUnread() {
    const currentUserId = this.props.currentUser._id
    Data.countUnread(currentUserId, count => {
      if (this.newCount !== count) {
        this.newCount = count

        if (count > 0) {
          document.title = `(${count}) - Tind3r`
        } else {
          document.title = 'Tind3r'
        }
      }
    })
  }

  render() {
    if (this.props.currentUser.isLoading) {
      return null
    }

    return (
      <div styleName="app-wrapper">
        <div styleName="page">
          <NavBar user={this.props.currentUser} newCount={this.newCount} />
          {this.props.children && React.cloneElement(this.props.children, {
            userStore: this.userStore,
            currentUser: this.props.currentUser,
          })}
        </div>
        <div styleName="footer">
          Copyright &copy; Rafal Lesniak | Privacy Policy
        </div>
        <Alert contentTemplate={MatchAlert} effect="flip" stack />
      </div>
    );
  }
}
