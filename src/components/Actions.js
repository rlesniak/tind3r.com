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
      _.each(data.reverse(), action => {
        actions.push(this.renderAction(action))
      })

      this.actions = actions
      this.forceUpdate()
    })
  }

  renderAction(data) {
    if (!data.user) {
      return null
    }

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
      <div className="main-wrapper">
        <ul>
          {this.actions}
        </ul>
      </div>
    )
  }
}
