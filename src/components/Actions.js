import React, { Component } from 'react';
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import _ from 'lodash'
import Data from '../data'

export default class Actions extends Component {
  @observable actions = []

  constructor(props) {
    super(props)

    this.getActions()
  }

  getActions() {
    const actions = []

    Data.actions().then(data => {
      _.each(data, action => {
        actions.push(this.renderAction(action))
      })

      this.actions = actions
      this.forceUpdate()
    })
  }

  renderAction(data) {
    return (
      <li key={data.user._id}>
        <Link to={`/users/${data.user._id}`}>
          {data.user.name}: {data.type}
        </Link>
      </li>
    )
  }

  render() {
    return (
      <div>
        <ul>
          {this.actions}
        </ul>
      </div>
    )
  }
}
