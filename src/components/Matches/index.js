import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import _ from 'lodash'
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

  constructor(props) {
    super(props)
    this.matchStore = new MatchStore()
  }

  @autobind
  handleSelect(id) {
    this.seletedMatch = this.matchStore.findMatch(id)
    this.matchStore.setAsDone(this.seletedMatch)
  }

  render() {
    return (
      <div className="main-wrapper" styleName="wrapper">
        <div styleName="matches">
          {!this.matchStore.isLoading && _.map(this.matchStore.byDate, match => (
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
