import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable, computed, extendObservable, action } from 'mobx'
import _ from 'lodash'
import ReactGA from 'react-ga'
import Select from 'react-basic-dropdown'
import { observer } from 'mobx-react'
import MatchStore from 'stores/MatchStore'
import styles from './index.scss'
import Match from './components/Match'
import Data from 'data'
import Loader from 'screens/App/shared/Loader'

const sortOptions = [
  { label: 'Select filter', value: -1, disabled: true },
  { label: 'None', value: '' },
  { label: 'Without messages', value: 'withoutMsgs' },
  { label: 'Unaswered', value: 'unanswered' },
]

const ORDER_DIR_MAP = {
  true: 'desc',
  false: 'asc',
}

@observer
@CSSModules(styles)
export default class Matches extends Component {
  @observable seletedMatch
  @observable searchValue = ''
  @observable orderBy = ''
  @observable filterOption = -1
  @observable orderDirection = {
    age: null,
    date: true,
    messages: null,
  }

  constructor(props) {
    super(props)
    this.matchStore = new MatchStore()
  }

  @computed get list() {
    let values = this.matchStore.byDate
    if (this.searchValue.length) {
      values = values.filter(match => {
        const name = match.user.name || ''
        return _.includes(name.toLowerCase(), this.searchValue.toLowerCase())
      })
    }

    if (this.orderBy !== null) {
      switch (this.orderBy) {
        case 'age':
          values = _.orderBy(values, m => m.user.age, ORDER_DIR_MAP[this.orderDirection.age])
          break;
        case 'date':
          values = _.orderBy(values, m =>
            m.lastActvityTime, ORDER_DIR_MAP[this.orderDirection.date],
          )
          break;
        case 'messages':
          values = _.orderBy(values, m =>
            m.messageStore.messages.length, ORDER_DIR_MAP[this.orderDirection.messages],
          )
          break;
        default:
      }
    }

    return values
  }

  @autobind
  handleSelect(id) {
    this.seletedMatch = this.matchStore.findMatch(id)
    this.matchStore.setAsDone(this.seletedMatch)
  }

  @autobind
  markAsRead() {
    this.matchStore.markAsRead()

    ReactGA.event({
      category: 'Match',
      action: 'Mark as seen',
    })
  }

  @autobind
  clearBlocked() {
    this.matchStore.clearBlocked()

    ReactGA.event({
      category: 'Match',
      action: 'Clear blocked',
    })
  }

  @autobind
  handleSearch(e) {
    this.searchValue = e.target.value
  }

  resetOrderDirectionWithout(ommited) {
    const updated = _.omit({
      age: null,
      date: null,
    }, ommited)

    extendObservable(this.orderDirection, updated)
  }

  handleOrder(by) {
    this.resetOrderDirectionWithout(by)
    this.orderBy = by
    this.orderDirection[by] = !this.orderDirection[by]

    ReactGA.event({
      category: 'Match',
      action: 'Change order',
    })
  }

  renderOrderIcon(target) {
    if (this.orderDirection[target] === null) {
      return <i className="fa fa-sort" />
    }

    return (
      <span>
        {this.orderDirection[target] ?
          <i className="fa fa-sort-numeric-desc" /> : <i className="fa fa-sort-numeric-asc" />
        }
      </span>
    )
  }

  @autobind
  handleFilterChange({ value }) {
    this.filterOption = value
    this.matchStore.setFilter(value)
  }

  @autobind
  reset() {
    this.orderBy = 'date'
    this.orderDirection = {
      age: null,
      date: true,
      messages: null,
    }
  }

  render() {
    return (
      <div className="main-wrapper" styleName="wrapper">
        <div styleName="matches">
          {!this.matchStore.isLoading && <div styleName="actions">
            <div styleName="action-wrapper" onClick={this.search}>
              <input
                type="text"
                placeholder="Search by name"
                value={this.searchValue}
                onChange={this.handleSearch}
              />
            </div>
            {
              this.matchStore.unreadCount > 0 &&
              <div styleName="action-wrapper" onClick={this.markAsRead}>
                <span styleName="action">
                  <i className="fa fa-check-square-o" /> Mark all as seen
                </span>
              </div>
            }
            {
              this.matchStore.blockedCount > 0 &&
              <div styleName="action-wrapper" onClick={this.clearBlocked}>
                <span styleName="action">
                  <i className="fa fa-check-square-o" /> Clear all blocked
                </span>
              </div>
            }
            <div styleName="quick">
              <button onClick={this.handleOrder.bind(this, 'date')}>
                {this.renderOrderIcon('date')}
                by recent
              </button>
              <button onClick={this.handleOrder.bind(this, 'age')}>
                {this.renderOrderIcon('age')}
                by age
              </button>
              <button onClick={this.handleOrder.bind(this, 'messages')}>
                {this.renderOrderIcon('messages')}
                by messages count
              </button>
              <button onClick={this.reset}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div styleName="action-wrapper" className="filter">
              <Select
                options={sortOptions}
                value={this.filterOption}
                onChange={this.handleFilterChange}
              />
            </div>
          </div>}
          {this.matchStore.isLoading && <Loader isSimpleLoader />}
          {!this.matchStore.isLoading && _.map(this.list, match => (
            <Match key={match.id} match={match} />
          ))}
        </div>
        <div styleName="messages">
          {this.props.children && React.cloneElement(this.props.children, {
            matchStore: this.matchStore,
          })}
        </div>
      </div>
    );
  }
}
