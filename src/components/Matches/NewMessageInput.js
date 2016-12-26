import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import _ from 'lodash'
import { Link } from 'react-router'
import Select from 'react-basic-dropdown'
import cx from 'classnames'
import { observer } from 'mobx-react'
import Spinner from '../Spinner'
import styles from './new-message-input.scss'

@observer
@CSSModules(styles)
export default class NewMessageInput extends Component {
  @observable isTryingToSend = false
  @observable messageTxt = ''

  constructor(props) {
    super(props)

    const lsDelay = localStorage.getItem('sendDelay')

    this.sendTimeoutFn = n => n
    this.sendDelaySec = lsDelay === null ? '0' : lsDelay
  }

  componentDidUpdate(prevProps, prevState) {
    this.inputRef.focus()
  }

  componentDidMount() {
    document.addEventListener('keydown', this.stopSending)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.stopSending)
  }

  processSubmit(msg) {
    const { messageStore } = this.props
    messageStore.create(msg)
    this.messageTxt = ''
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
    const msg =  _.trim(this.messageTxt)

    if (msg.length === 0) return

    this.isTryingToSend = true
    this.sendTimeoutFn = setTimeout(() => {
      this.isTryingToSend = false

      this.processSubmit(msg)
    }, this.sendDelaySec * 1000)
  }

  @autobind
  handleMessageChange(e) {
    this.messageTxt = e.target.value
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
    localStorage.setItem('sendDelay', option.value)
  }

  render() {
    const { user } = this.props

    const sendStyle = cx({
      disabled: _.trim(this.messageTxt).length === 0
    })

    const inputWrapperStyle = cx({
      trying: this.isTryingToSend && this.sendDelaySec > 0,
    })

    const options = [
      { label: '0s', value: '0', },
      { label: '1s', value: '1' },
      { label: '2s', value: '2' },
      { label: '3s', value: '3' },
    ]

    return (
      <div styleName="new-message-input" className={inputWrapperStyle}>
        <textarea
          autoFocus
          type="text"
          ref={ref => { this.inputRef = ref }}
          onChange={this.handleMessageChange}
          onKeyPress={this.handleSubmit}
          value={this.messageTxt}
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
              placeholder="0s"
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
    );
  }
}
