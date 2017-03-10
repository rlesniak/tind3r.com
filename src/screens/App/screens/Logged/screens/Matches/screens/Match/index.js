import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import _ from 'lodash'
import cx from 'classnames'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import sentences from 'const/sentence'
import styles from './index.scss'
import Message from './components/Message'
import NewMessageInput from './components/NewMessageInput'
import Profile from './components/Profile'

@observer
@CSSModules(styles)
export default class Messages extends Component {
  @observable match = {}
  @observable isProfileVisible = true;

  constructor(props) {
    super(props)

    this.matchId = props.params.matchId
    this.match = props.matchStore.findMatch(this.matchId)
  }

  componentDidMount() {
    this.scrollIntoView()
    this.setAsRead()
  }

  componentWillReceiveProps(nextProps) {
    this.matchId = nextProps.params.matchId
    this.match = this.props.matchStore.findMatch(this.matchId)

    this.setAsRead()
  }

  shouldComponentUpdate(nextProps) {
    return this.props.params.matchId !== nextProps.params.matchId
  }

  componentDidUpdate() {
    this.scrollIntoView()
  }

  setAsRead() {
    if (!this.match) return

    this.props.matchStore.setAsRead(this.match)
  }

  scrollIntoView() {
    if (!this.match) {
      return
    }

    const lastId = this.match.messageStore.messages.length - 1
    if (this[`msg${lastId}`]) {
      this[`msg${lastId}`].wrappedInstance.scrollIntoView()
    }
  }

  @autobind
  handleRemoveMatch() {
    this.props.router.push('/matches')
    this.match.remove()
  }

  @autobind
  toggleVisible() {
    this.isProfileVisible = !this.isProfileVisible
  }

  renderSentence() {
    const id = _.random(sentences.length - 1)

    if (this.match.messageStore.messages.length || this.match.isBlocked) {
      return null
    }

    return <h1>{sentences[id]}</h1>
  }

  render() {
    if (!this.match) {
      return null
    }

    return (
      <div styleName="wrapper">
        <div styleName="messages-wrapper">
          <div styleName="messages" ref={ref => { this.messagesRef = ref }}>
            {_.map(this.match.messageStore.messages, (msg, i) => (
              <Message
                key={msg.id}
                ref={ref => { this[`msg${i}`] = ref }}
                message={msg}
                recipient={this.match.user}
              />
            ))}
            {this.renderSentence()}
          </div>
          <NewMessageInput
            match={this.match}
            messageStore={this.match.messageStore}
            removeMatch={this.handleRemoveMatch}
          />
          <div
            styleName="toggle"
            className={cx({ hidden: !this.isProfileVisible })}
            onClick={this.toggleVisible}
          >
            {this.isProfileVisible && <i className="fa fa-chevron-right" />}
            {!this.isProfileVisible && <i className="fa fa-chevron-left" />}
          </div>
        </div>
        <div styleName="profile" className={cx({ hidden: !this.isProfileVisible })}>
          {
            this.match && this.isProfileVisible &&
            <Profile user={this.match.user} match={this.match} />
          }
        </div>
      </div>
    )
  }
}
