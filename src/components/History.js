import React, { Component } from 'react';
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import Data from '../data'
import styles from './history.scss'
import moment from 'moment'

@CSSModules(styles)
export default class History extends Component {
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
      <li key={data.user._id} className={data.type}>
        <Link to={`/users/${data.user._id}`}>
          <table>
            <tbody>
              <tr>
                <td rowSpan="2">
                  <div styleName="avatar">
                    <img src={data.user.photos[0].url} />
                  </div>
                </td>
                <td><span styleName="name">{data.user.name}</span></td>
              </tr>
              <tr>
                <td>{moment(new Date(data.date)).fromNow()}</td>
              </tr>
            </tbody>
          </table>
        </Link>
      </li>
    )
  }

  render() {
    return (
      <div styleName="wrapper" className="main-wrapper">
        <ul>
          {this.actions}
        </ul>
      </div>
    )
  }
}
