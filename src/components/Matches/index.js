import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import { Link } from 'react-router'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './styles.scss'
import MatchStore from '../../stores/MatchStore'
import Match from './Match'
import Messages from './Messages'
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
          {!this.matchStore.isLoading && _.map(this.matchStore.matches.reverse(), match => (
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
          {this.seletedMatch && <Link to={`/users/${this.seletedMatch.user._id}`}>
            Profile
          </Link>}
        </div>
      </div>
    );
  }
}
