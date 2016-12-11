import React, { Component } from 'react';
import { observer } from 'mobx-react'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import { user } from '../runtime'
import User from '../models/User'
import Loader from './Loader'

@observer
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.user = new User(null, props.params.userId)
    this.user.fetch()
  }

  renderUser() {
    return (
      <div key={this.user.id}>
        {this.user.name}
        {this.user.bio}
        {_.map(this.user.photos, photo => (
          <img key={_.uniqueId()} src={photo.url} alt="img" style={{width: 200}} />
        ))}
      </div>
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
