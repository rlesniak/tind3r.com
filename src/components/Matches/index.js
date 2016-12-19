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

@observer
@CSSModules(styles)
export default class Matches extends Component {
  @observable activeConversationId

  constructor(props) {
    super(props)
    this.conversationsStore = new ConversationStore()
    this.conversationsStore.fetch()
  }

  @autobind
  handleSelect(id) {
    this.activeConversationId = id
  }

  render() {
    const activeConversation = this.conversationsStore.findConversation(this.activeConversationId)
    return (
      <div className="main-wrapper" styleName="wrapper">
        <div styleName="coversations">
          {_.map(this.conversationsStore.conversations.reverse(), conv => (
            <Conversation
              key={conv.id}
              conversation={conv}
              handleSelect={this.handleSelect}
            />
          ))}
        </div>
        <div styleName="messages">
          <Messages
            conversation={activeConversation}
          />
        </div>
        <div styleName="profile">
          <Link to={`/users/${this.activeConversationId}`}>
            Profile
          </Link>
        </div>
      </div>
    );
  }
}

Matches.defaultProps = {
  conversationsStore: new ConversationStore(),
}
