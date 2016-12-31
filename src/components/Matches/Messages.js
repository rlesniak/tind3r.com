import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './messages.scss'
import Message from './Message'
import sentences from '../../const/sentence'
import NewMessageInput from '././NewMessageInput'

@observer
@CSSModules(styles)
export default class Messages extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.scrollIntoView()
  }

  componentDidMount() {
    this.scrollIntoView()
  }

  scrollIntoView() {
    const { match } = this.props

    if (!match) {
      return
    }

    const lastId = match.messageStore.messages.length - 1
    if(this[`msg${lastId}`]) {
      this[`msg${lastId}`].wrappedInstance.scrollIntoView()
    }
  }

  renderSentence() {
    const { match } = this.props
    const id = _.random(sentences.length - 1)

    if (match.messageStore.messages.length) return

    return <h1>{sentences[id]}</h1>
  }

  render() {
    const { match } = this.props
    if (!match) {
      return null
    }

    return (
      <div styleName="wrapper">
        <div styleName="messages" ref={ref => this.messagesRef = ref}>
          {_.map(match.messageStore.messages, (msg, i) => (
            <Message
              key={msg.id}
              ref={ref => this[`msg${i}`] = ref}
              message={msg}
              recipient={match.user}
            />
          ))}
          {this.renderSentence()}
        </div>
        <NewMessageInput match={match} messageStore={match.messageStore} />
      </div>
    )
  }
}
