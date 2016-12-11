import React, { Component } from 'react';
import { observer } from 'mobx-react'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import { user } from '../runtime'
import User from '../models/User'
import Loader from './Loader'
import UserCard from './Home/UserCard'

@observer
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.user = new User(null, props.params.userId)
    this.user.fetch()
  }

  renderUser() {
    return (
      <UserCard user={this.user} extended />
    )
  }

  render() {
    return (
      <div>
        {this.user.isLoading && <Loader />}
        {this.renderUser()}
      </div>
    );
  }
}
