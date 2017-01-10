import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
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

        if (resp.rating.likes_remaining === 0) {
          localStorage.setItem('likeExpiration', resp.rating.rate_limited_until)
        }

        this.userStore.core()
        this.afterSucessLogin()
      }).catch(status => {
        browserHistory.push('/fb-connect')
      })
    })
  }

  afterSucessLogin() {
    const isFirstFetch = !localStorage.getItem('firstFetchDone')

    if (isFirstFetch) {
      Data.updates(true).then(() => this.runInterval())
      localStorage.setItem('firstFetchDone', true)
    } else {
      this.runInterval()
    }

    this.countUnread()
    this.registerHook()
  }

  runInterval() {
    if (process.env.NODE_ENV === 'production') {
    // if (1) {
      setInterval(() => {
        Data.updates()
      }, 1500)
    }
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
          document.title = `(${count}) - Tind3r - Unofficial Tinder client`
        } else {
          document.title = 'Tind3r - Unofficial Tinder client'
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
        <div className="footer">
          Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a> | <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
        <Alert contentTemplate={MatchAlert} effect="flip" stack />
      </div>
    );
  }
}
