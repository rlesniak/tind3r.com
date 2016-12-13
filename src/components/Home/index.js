import React, { Component } from 'react';
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import UserStore from '../../stores/UserStore'
import UserCard from './UserCard'
import UserCardList from './UserCardList'
import Loader from '../Loader'
import styles from './styles.scss'

@observer
@CSSModules(styles)
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      exhausted: false,
    }

    this.userStore = new UserStore()
  }

  componentDidMount() {
    this.width = window.innerWidth
  }

  render() {
    return (
      <div styleName="home">
        {this.userStore.isConnecting && <h1>Need connect</h1>}
        {this.userStore.isLoading && <Loader />}
        <div styleName="recommendation">
          {!this.userStore.isLoading && <UserCard user={this.userStore.first} />}
        </div>
        <UserCardList users={this.userStore} />
      </div>
    );
  }
}
