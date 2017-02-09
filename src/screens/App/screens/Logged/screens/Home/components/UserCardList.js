import React, { Component } from 'react';
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import UserCard from './UserCard'
import styles from './UserCardList.scss'

@observer
@CSSModules(styles)
export default class UserCardList extends Component {

  @autobind
  handleLoadMore() {
    const { userStore } = this.props
    userStore.core(true)
  }

  renderUser(user) {
    const { userStore } = this.props
    return (
      <UserCard key={user.id} user={user} userStore={userStore} simple />
    )
  }

  render() {
    const { userStore } = this.props
    return (
      <div styleName="list">
        {userStore.tail.map(u => this.renderUser(u))}
        {!userStore.isCharging && <UserCard asLoadMore handleLoadMore={this.handleLoadMore} />}
        {userStore.isCharging && <UserCard asLoader />}
      </div>
    );
  }
}
