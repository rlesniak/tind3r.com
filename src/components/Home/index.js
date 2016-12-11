import React, { Component } from 'react';
import { observer } from 'mobx-react'
import _ from 'lodash'
import UserStore from '../../stores/UserStore'
import UserCard from './UserCard'
import Loader from '../Loader'

@observer
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

  renderUser(user) {
    return (
      <UserCard key={user.id} user={user} />
    )
  }

  render() {
    return (
      <div>
        {this.userStore.isConnecting && <h1>Need connect</h1>}
        {this.userStore.isLoading && <Loader />}
        {this.userStore.users.map(u => this.renderUser(u))}
      </div>
    );
  }
}
