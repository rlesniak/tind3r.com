import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import ReactGA from 'react-ga'
import _ from 'lodash'
import { Link } from 'react-router'
import Select from 'react-basic-dropdown'
import cx from 'classnames'
import { observer } from 'mobx-react'
import Spinner from '../Spinner'
import styles from './new-message-input.scss'
import Data from '../../data'

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
    if (this.inputRef) {
      this.inputRef.focus()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
  }

  processSubmit(msg) {
    const { messageStore } = this.props
    messageStore.create(msg)
    this.messageTxt = ''
  }

  @autobind
  onKeydown(e) {
    if (e.keyCode === 27) {
      clearTimeout(this.sendTimeoutFn)
      this.isTryingToSend = false

      if (this.inputRef) {
        this.inputRef.focus()
      }

      ReactGA.event({
        category: 'Message',
        action: 'Cancel',
      })
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

      ReactGA.event({
        category: 'Message',
        action: 'Submit',
        label: 'Enter',
      })

      this.submit()
    }
  }

  @autobind
  setAsRead() {
    const { messageStore } = this.props

    Data.db().matches.update(messageStore.matchId, { isNew: 0 })
  }

  @autobind
  handleDelayChange(option) {
    this.sendDelaySec = option.value
    localStorage.setItem('sendDelay', option.value)

    ReactGA.event({
      category: 'Message',
      action: 'Delay',
      value: Number(option.value),
    })
  }

  render() {
    const { user, match } = this.props

    const sendStyle = cx({
      disabled: _.trim(this.messageTxt).length === 0
    })

    const inputWrapperStyle = cx({
      trying: this.isTryingToSend && this.sendDelaySec > 0,
    })

    if (match.isBlocked) {
      return (
        <div styleName="new-message-input">
          <h1>You have been blocked.<br/>What went wrong?</h1>
        </div>
      )
    }

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
          onFocus={this.setAsRead}
          onBlur={this.setAsRead}
        />
        <div styleName="actions">
          <div styleName="delay" title="Sending delay in sec">
            <i className="fa fa-clock-o" />
            <Select
              value={this.sendDelaySec}
              options={options}
              onChange={this.handleDelayChange}
              placeholder="0s"
            />
          </div>
          <div>
            {this.isTryingToSend && <Spinner align="right"><span styleName="esc">ESC</span></Spinner>}
          </div>
          {!this.isTryingToSend && <button styleName="send" className={sendStyle} onClick={this.submit}>
            <i className="fa fa-paper-plane" />
          </button>}
        </div>
      </div>
    );
  }
}
