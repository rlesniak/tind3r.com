import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import moment from 'moment'
import _ from 'lodash'
import UserStore from '../../stores/UserStore'
import UserCard from './UserCard'
import UserCardList from './UserCardList'
import Loader from '../Loader'
import styles from './styles.scss'

@observer
@CSSModules(styles)
export default class Home extends Component {

  @autobind
  refresh() {
    const { userStore } = this.props
    userStore.core()
  }

  renderLoader() {
    const { userStore, currentUser } = this.props

    if (!userStore.isLoading) {
      return null
    }

    return (
      <div>
        <Loader currentUser={currentUser} />
        <div styleName="message">Finding people near you...</div>
      </div>
    )
  }

  renderMsg() {
    const { userStore, currentUser } = this.props

    return (
      <div>
        <Loader currentUser={currentUser} noAnimation />
        <div styleName="message">
          {userStore.message}
          <button onClick={this.refresh}><i className="fa fa-refresh" /></button>
        </div>
      </div>
    )
  }
  renderRecs() {
    const { userStore } = this.props

    if (userStore.isLoading) {
      return this.renderLoader()
    }

    if (userStore.message) {
      return this.renderMsg()
    }

    return (
      <div styleName="home">
        <div styleName="recommendation">
          <UserCard user={userStore.first} withSuperLikeCounter />
        </div>
        <UserCardList userStore={userStore} />
      </div>
    )
  }

  render() {
    const { userStore, currentUser } = this.props

    return this.renderRecs()
  }
}
