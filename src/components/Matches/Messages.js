import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import { observer } from 'mobx-react'
import styles from './messages.scss'
import Message from './Message'

@observer
@CSSModules(styles)
export default class Messages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messageTxt: '',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollIntoView()
  }

  componentDidMount() {
    this.scrollIntoView()
  }

  scrollIntoView() {
    const { conversation } = this.props

    if (!conversation) {
      return
    }

    const lastId = conversation.messageStore.messages.length - 1
    if(this[`msg${lastId}`]) {
      this[`msg${lastId}`].scrollIntoView()
    }
  }

  @autobind
  handleMessageChange(e) {
    this.setState({
      messageTxt: e.target.value,
    })
  }

  @autobind
  handleSubmit(e) {
    const { conversation } = this.props
    if (e.charCode === 13) {
      e.preventDefault()

      conversation.messageStore.updateMessage({
        id: _.uniqueId(),
        message: this.state.messageTxt,
      })

      this.setState({
        messageTxt: '',
      })
    }
  }

  render() {
    const { conversation } = this.props
    if (!conversation) {
      return null
    }

    return (
      <div styleName="wrapper">
        <div styleName="messages" ref={ref => this.messagesRef = ref}>
          {_.map(conversation.messageStore.messages, (msg, i) => (
            <Message
              key={msg.id}
              ref={ref => this[`msg${i}`] = ref}
              message={msg}
            />
          ))}
        </div>
        <div styleName="new-message-input">
          <textarea
            type="text"
            onChange={this.handleMessageChange}
            onKeyPress={this.handleSubmit}
            value={this.state.messageTxt}
          />
        </div>
      </div>
    );
  }
}
