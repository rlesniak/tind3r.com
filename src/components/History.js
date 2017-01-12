import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import Data from '../data'
import styles from './history.scss'
import moment from 'moment'

@CSSModules(styles)
export default class History extends Component {
  constructor(props) {
    super(props)

    this.state = {
      actions: []
    }
  }

  componentDidMount() {
    this.getActions()
  }

  getActions() {
    const actions = []

    Data.actions().then(data => {
      _.each(_.orderBy(data, 'date', 'desc'), action => {
        actions.push(this.renderAction(action))
      })

      this.setState({
        actions
      })
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
    const { actions } = this.state

    if (actions.length === 0) {
      return (
        <div styleName="wrapper" className="main-wrapper table">
          <div styleName="table">
            <h1>
              <i className="fa fa-frown-o" />
              <span>You have no actions saved in this browser.</span>
            </h1>
          </div>
        </div>
      )
    }

    return (
      <div styleName="wrapper" className="main-wrapper">
        <ul>
          {actions}
        </ul>
      </div>
    )
  }
}
