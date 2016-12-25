import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import cx from 'classnames'
import { observer } from 'mobx-react'
import styles from '././conversation.scss'
import ConversationStore from '../../stores/ConversationStore'
import Data from '../../data'

@observer
@CSSModules(styles)
export default class Conversation extends Component {
  constructor(props) {
    super(props)
  }

  @autobind
  handleSelect() {
    const { conversation } = this.props
    this.props.handleSelect(conversation.id)
  }

  @autobind
  remove() {
    const { conversation } = this.props
    Data.db().matches.where('_id').equals(conversation.id).delete()
  }

  renderIcon() {
    const { conversation } = this.props

    if (!conversation.messageStore.last.message) {
      return null
    }

    if (conversation.messageStore.last.isAuthor) {
      return <i className="fa fa-arrow-down" aria-hidden="true" />
    }

    return <i className="fa fa-arrow-up" aria-hidden="true"></i>
  }

  render() {
    const { conversation } = this.props
    const className = cx({
      unread: conversation.isNew,
    })
    return (
      <div styleName="coversation" className={className} onClick={this.handleSelect}>
        <div styleName="avatar">
          <img src={conversation.user.photos[0].url} />
        </div>
        <div styleName="name">{conversation.user.name}</div>
        <div styleName="message">{this.renderIcon()} {conversation.messageStore.last.message}</div>
        <div styleName="date">{conversation.messageStore.last.date}</div>
      </div>
    );
  }
}
