import React, { Component } from 'react';
import autobind from 'autobind-decorator'
import { Link } from 'react-router'
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import cx from 'classnames'
import Data from 'data'
import moment from 'moment'
import styles from './History.scss'

const filtersButtonsMap = [
  { icon: 'fa-thumbs-o-down', text: 'Passed', filter: 'pass' },
  { icon: 'fa fa-star', text: 'Liked', filter: 'like' },
  { icon: 'fa fa-heart', text: 'Super Liked', filter: 'superlike' },
]

@CSSModules(styles)
export default class History extends Component {
  constructor(props) {
    super(props)

    this.state = {
      actions: [],
      isLoading: true,
      filter: null,
      searchQuery: '',
    }
  }

  componentDidMount() {
    this.fetchActions()
  }

  getComputed() {
    const { filter, actions, searchQuery } = this.state
    let computed = actions

    if (filter) {
      computed = _.filter(computed, { type: filter })
    }

    if (searchQuery) {
      computed = _.filter(computed, a =>
        _.includes((a.user ? a.user.name : '').toLowerCase(), searchQuery.toLowerCase()),
      )
    }

    return computed
  }

  fetchActions() {
    const actions = []

    Data.actions().then((data) => {
      _.each(_.orderBy(data, 'date', 'desc'), (action) => {
        actions.push(action)
      })

      this.setState({
        actions,
        isLoading: false,
      })
    })
  }

  handleFilter(value) {
    this.setState({
      filter: value,
    })
  }

  @autobind
  handleSearch(e) {
    this.setState({
      searchQuery: e.target.value,
    })
  }

  @autobind
  handleReset() {
    this.setState({
      filter: null,
      searchQuery: '',
    })
  }

  @autobind
  handleClear() {
    Data.removeActions()

    this.setState({
      actions: [],
    })
  }

  renderTopBar(count) {
    return (
      <div styleName="bar">
        <span  styleName="count">({count})</span>
        <div styleName="search">
          <input
            type="text"
            placeholder="Search"
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />
        </div>
        <div styleName="filters">
          {_.map(filtersButtonsMap, (data) => {
            const className = cx({
              active: this.state.filter === data.filter,
            })
            const onClick = this.handleFilter.bind(this, data.filter)

            return (
              <span
                key={_.uniqueId()}
                styleName="action"
                className={className}
                onClick={onClick}
              >
                <i className={`fa ${data.icon}`} /> {data.text}
              </span>
            )
          })}
          <span
            styleName="action"
            onClick={this.handleReset}
          >
            <i className="fa fa-times" />
          </span>
        </div>
        <div styleName="clear" onClick={this.handleClear}>
          <i className="fa fa-trash" /> Clear
        </div>
      </div>
    )
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
    const { actions, isLoading } = this.state

    if (actions.length === 0 && !isLoading) {
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

    const filtered = this.getComputed()

    return (
      <div styleName="wrapper" className="main-wrapper">
        {this.renderTopBar(filtered.length)}
        <div styleName="content">
          <ul>
            {filtered.map(this.renderAction)}
          </ul>
        </div>
      </div>
    )
  }
}
