import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules'
import { observable } from 'mobx'
import autobind from 'autobind-decorator'
import ReactGA from 'react-ga'
import { IntercomAPI } from 'react-intercom'
import _ from 'lodash'
import { Link } from 'react-router'
import Select from 'react-basic-dropdown'
import cx from 'classnames'
import { observer } from 'mobx-react'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import Spinner from '../Spinner'
import styles from './new-message-input.scss'
import Data from '../../data'
import GifInput from './GifInput'
import ls from '../../local-storage'

@observer
@CSSModules(styles)
export default class NewMessageInput extends Component {
  @observable isTryingToSend = false
  @observable messageTxt = ''
  @observable isEmojiOpen = false
  @observable isGifInputOpen = false

  constructor(props) {
    super(props)

    const lsDelay = ls.data.sendDelay

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
  onMouseDown(e) {
    const picker = ReactDOM.findDOMNode(this.pickerRef)
    if (!picker.contains(e.target)) {
      this.closeEmoji()
    }
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

      this.closeEmoji()

      ReactGA.event({
        category: 'Message',
        action: 'Submit',
        label: 'Enter',
      })

      IntercomAPI('trackEvent', 'submit-message');

      this.submit()
    }
  }

  @autobind
  setAsRead() {
    const { messageStore } = this.props

    Data.db().matches.update(messageStore.matchId, { isNew: 0 })
    messageStore.match.isNew = false
  }

  @autobind
  handleDelayChange(option) {
    this.sendDelaySec = option.value
    ls.set({ sendDelay: this.sendDelaySec })

    ReactGA.event({
      category: 'Message',
      action: 'Delay',
      value: Number(option.value),
    })
  }

  @autobind
  openEmoji() {
    document.addEventListener('mousedown', this.onMouseDown)
    this.isEmojiOpen = true

    ReactGA.event({
      category: 'Message',
      action: 'Emoji',
      label: 'Open',
    })
  }

  @autobind
  closeEmoji() {
    document.removeEventListener('mousedown', this.onMouseDown)
    this.isEmojiOpen = false
  }

  @autobind
  toggleEmoji() {
    this.isEmojiOpen ? this.closeEmoji() : this.openEmoji()
  }

  @autobind
  emojiSelected(emoji) {
    this.messageTxt += emoji.native

    ReactGA.event({
      category: 'Message',
      action: 'Emoji',
      label: 'Select',
    })
  }

  @autobind
  showGifInput() {
    this.closeEmoji()

    this.isGifInputOpen = true

    ReactGA.event({
      category: 'Message',
      action: 'Gif',
      label: 'Open',
    })
  }

  @autobind
  handleGifClose() {
    this.isGifInputOpen = false
  }

  @autobind
  handleGifSubmit(body, payload) {
    const { messageStore } = this.props
    messageStore.create(body, payload)

    ReactGA.event({
      category: 'Message',
      action: 'Gif',
      label: 'Submit',
    })
  }

  render() {
    const { user, match, removeMatch } = this.props

    const sendStyle = cx({
      disabled: _.trim(this.messageTxt).length === 0
    })

    const inputWrapperStyle = cx({
      trying: this.isTryingToSend && this.sendDelaySec > 0,
    })

    if (match.isBlocked) {
      return (
        <div styleName="new-message-input" className="block">
          <h1>Blocked.</h1>
          <button className="button red" onClick={removeMatch}>Remove match</button>
        </div>
      )
    }

    if (this.isGifInputOpen) {
      return (
        <GifInput onClose={this.handleGifClose} onSubmit={this.handleGifSubmit} />
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
        <div styleName="emotions">
          {this.isEmojiOpen && <Picker
            emojiSize={24}
            perLine={9}
            skin={1}
            set='google'
            title="Pick your Emoji!"
            style={{ position: 'absolute', bottom: '81px', right: '137px' }}
            onClick={this.emojiSelected}
            ref={ref => { this.pickerRef = ref }}
          />}
        </div>
        <div styleName="actions">
          <button styleName="trigger" className="gif" onClick={this.showGifInput}>[ GIF ]</button>
          <button styleName="trigger" onClick={this.toggleEmoji}>Emoji</button>
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
