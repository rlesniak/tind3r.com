import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import _ from 'lodash'
import Intercom from 'react-intercom'
import { observer } from 'mobx-react'
import Alert from 'react-s-alert'
import cmp from 'semver-compare'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import User from 'models/User'
import Data from 'data'
import { checkIfInstalled, checkVersion } from 'runtime'
import notificationFile from 'static/notif.mp3'
import UserStore from 'stores/UserStore'
import ls from 'local-storage'
import NavBar from '../../shared/NavBar'
import MatchAlert from './components/MatchAlert'
import styles from './index.scss'
import { pageTitle } from 'utils'

@observer
@CSSModules(styles)
export default class App extends Component {
  @observable newCount = 0

  constructor(props) {
    super(props)

    this.userStore = new UserStore()

    this.userStore.core()
    this.afterSucessLogin()

    this.audio = new Audio(notificationFile)
  }

  afterSucessLogin() {
    const isFirstFetch = !ls.data.isFirstFetchDone

    if (isFirstFetch) {
      Data.updates(true).then(() => this.runInterval())
      ls.set({ isFirstFetchDone: true })
    } else {
      this.runInterval()
    }

    this.countUnread()
    this.registerHook()
  }

  runInterval() {
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        Data.updates()
      }, 1500)
    }
  }

  registerHook() {
    Data.registerMatchesHook(() => {
      setTimeout(() => this.countUnread(), 0) // TODO: remove timeout
    }, 'updating')

    Data.registerMatchesHook(() => {
      setTimeout(() => {
        this.countUnread()
      }, 0) // TODO: remove timeout
    })
  }

  countUnread() {
    const currentUserId = this.props.currentUser._id
    Data.countUnread(currentUserId, count => {
      if (this.newCount !== count) {
        this.newCount = count

        if (count > 0) {
          this.audio.play()
          document.title = pageTitle(`(${count})`)
        } else {
          document.title = pageTitle()
        }
      }
    })
  }

  render() {
    const { currentUser } = this.props

    if (currentUser.isLoading) {
      return null
    }

    const user = {
      user_id: currentUser._id,
      name: currentUser.name,
    }

    return (
      <div>
        <div>
          <NavBar user={currentUser} newCount={this.newCount} />
          {this.props.children && React.cloneElement(this.props.children, {
            userStore: this.userStore,
            currentUser: this.props.currentUser,
          })}
        </div>
        <Alert contentTemplate={MatchAlert} effect="flip" stack />
        <Intercom appID="budgcl9v" {...user} />
      </div>
    );
  }
}
