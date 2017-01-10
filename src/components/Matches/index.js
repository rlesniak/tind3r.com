import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable, computed } from 'mobx'
import _ from 'lodash'
import ReactGA from 'react-ga'
import { observer } from 'mobx-react'
import styles from './styles.scss'
import MatchStore from '../../stores/MatchStore'
import Match from './Match'
import Messages from './Messages'
import Profile from './Profile'
import Data from '../../data'

@observer
@CSSModules(styles)
export default class Matches extends Component {
  @observable seletedMatch
  @observable searchValue = ''

  constructor(props) {
    super(props)
    this.matchStore = new MatchStore()
  }

  @computed get list() {
    if (this.searchValue.length) {
      return this.matchStore.byDate.filter(match => {
        const name = match.user.name || ''
        return _.includes(name.toLowerCase(), this.searchValue.toLowerCase())
      })
    } else {
      return this.matchStore.byDate
    }
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
  handleSearch(e) {
    this.searchValue = e.target.value
  }

  render() {
    return (
      <div className="main-wrapper" styleName="wrapper">
        <div styleName="matches">
          {!this.matchStore.isLoading && <div styleName="actions">
            <div styleName="action" onClick={this.search}>
              <input
                type="text"
                placeholder="Search by name"
                value={this.searchValue}
                onChange={this.handleSearch}
              />
            </div>
            <div styleName="action" onClick={this.markAsRead}>
              <i className="fa fa-check-square-o" /> Mark all as seen
            </div>
          </div>}
          {this.matchStore.isLoading && <h1>Loading...</h1>}
          {!this.matchStore.isLoading && _.map(this.list, match => (
            <Match
              key={match.id}
              match={match}
              handleSelect={this.handleSelect}
            />
          ))}
        </div>
        <div styleName="messages">
          <Messages
            match={this.seletedMatch}
          />
        </div>
        <div styleName="profile">
          {this.seletedMatch && <Profile user={this.seletedMatch.user} />}
        </div>
      </div>
    );
  }
}
