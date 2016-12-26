import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import cx from 'classnames'
import Select from 'react-basic-dropdown'
import { observer } from 'mobx-react'
import styles from './messages.scss'
import Message from './Message'
import Spinner from '../Spinner'

@observer
@CSSModules(styles)
export default class Messages extends Component {
  @observable isTryingToSend = false

  constructor(props) {
    super(props)

    this.state = {
      messageTxt: '',
    }

    this.sendTimeoutFn = n => n
    this.sendDelaySec = 1
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollIntoView()
    this.inputRef.focus()
  }

  componentDidMount() {
    this.scrollIntoView()

    document.addEventListener('keydown', this.stopSending)
  }

  componentWillUnmount() {
    document.removeEventListener(this.stopSending)
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

  processSubmit(msg) {
    const { match } = this.props
    match.messageStore.create(msg)
    this.setState({
      messageTxt: '',
    })
  }

  @autobind
  stopSending(e) {
    if (e.keyCode === 27) {
      clearTimeout(this.sendTimeoutFn)
      this.isTryingToSend = false
      this.inputRef.focus()
    }
  }

  @autobind
  submit() {
    const msg =  _.trim(this.state.messageTxt)

    if (msg.length === 0) return

    this.isTryingToSend = true
    this.sendTimeoutFn = setTimeout(() => {
      this.isTryingToSend = false

      this.processSubmit(msg)
    }, this.sendDelaySec * 1000)
  }

  @autobind
  handleMessageChange(e) {
    this.setState({
      messageTxt: e.target.value,
    })
  }

  @autobind
  handleSubmit(e) {
    if (e.charCode === 13) {
      e.preventDefault()

      this.submit()
    }
  }

  @autobind
  handleDelayChange(option) {
    this.sendDelaySec = option.value
  }

  render() {
    const { match } = this.props
    if (!match) {
      return null
    }
    const msgTxt = _.trim(this.state.messageTxt)

    const sendStyle = cx({
      disabled: msgTxt.length === 0
    })

    const inputWrapperStyle = cx({
      trying: this.isTryingToSend,
    })

    const options = [
      { label: '0s', value: '0' },
      { label: '1s', value: 1 },
      { label: '2s', value: 2 },
      { label: '3s', value: 3 },
    ]

    return (
      <div styleName="wrapper">
        <div styleName="messages" ref={ref => this.messagesRef = ref}>
          {_.map(match.messageStore.messages, (msg, i) => (
            <Message
              key={msg.id}
              ref={ref => this[`msg${i}`] = ref}
              message={msg}
            />
          ))}
        </div>
        <div styleName="new-message-input" className={inputWrapperStyle}>
          <textarea
            autoFocus
            type="text"
            ref={ref => { this.inputRef = ref }}
            onChange={this.handleMessageChange}
            onKeyPress={this.handleSubmit}
            value={this.state.messageTxt}
            placeholder="Type your message..."
            disabled={this.isTryingToSend}
          />
          <div styleName="actions">
            <div styleName="delay">
              <i className="fa fa-clock-o" />
              <Select
                value={this.sendDelaySec}
                options={options}
                onChange={this.handleDelayChange}
              />
            </div>
            <div>
              {this.isTryingToSend && <Spinner align="right" />}
            </div>
            {!this.isTryingToSend && <button styleName="send" className={sendStyle} onClick={this.submit}>
              <i className="fa fa-paper-plane" />
            </button>}
          </div>
        </div>
      </div>
    );
  }
}
