import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
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

  render() {
    const { userStore } = this.props
    return (
      <div styleName="home">
        {userStore.isConnecting && <h1>Need connect</h1>}
        {userStore.message}
        {userStore.isLoading && <Loader />}
        <div styleName="recommendation">
          {!userStore.isLoading && <UserCard user={userStore.first} withSuperLikeCounter />}
        </div>
        {!userStore.isLoading && <UserCardList userStore={userStore} />}
      </div>
    );
  }
}

Home.defaultProps = {
  userStore: new UserStore(),
}
