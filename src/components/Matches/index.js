import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import { observable } from 'mobx'
import { Link } from 'react-router'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './styles.scss'
import ConversationStore from '../../stores/ConversationStore'
import Conversation from './Conversation'
import Messages from './Messages'
import Data from '../../data'

@observer
@CSSModules(styles)
export default class Matches extends Component {
  @observable activeConversation

  constructor(props) {
    super(props)
    this.cs = new ConversationStore()
  }

  @autobind
  handleSelect(id) {
    this.activeConversation = this.cs.findConversation(id)
    this.cs.setAsDone(this.activeConversation)
  }

  render() {
    return (
      <div className="main-wrapper" styleName="wrapper">
        <div styleName="coversations">
          {!this.cs.isLoading && _.map(this.cs.conversations.reverse(), conv => (
            <Conversation
              key={conv.id}
              conversation={conv}
              handleSelect={this.handleSelect}
            />
          ))}
        </div>
        <div styleName="messages">
          <Messages
            conversation={this.activeConversation}
          />
        </div>
        <div styleName="profile">
          {this.activeConversation && <Link to={`/users/${this.activeConversation.user._id}`}>
            Profile
          </Link>}
        </div>
      </div>
    );
  }
}

Matches.defaultProps = {
  cs: new ConversationStore(),
}
