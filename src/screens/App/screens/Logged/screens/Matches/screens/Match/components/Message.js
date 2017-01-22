import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import moment from 'moment'
import cx from 'classnames'
import { observer, inject } from 'mobx-react'
import Img from 'screens/App/shared/Img'
import styles from './Message.scss'

@inject('currentUser')
@observer
@CSSModules(styles)
export default class Message extends Component {
  scrollIntoView() {
    this.wrapper.scrollIntoView()
  }

  renderMessageContent() {
    const { message } = this.props

    if (message.type === 'gif') {
      return <div styleName="gif"><img src={message.fixed_height} alt="gif" /></div>
    }

    return message.message
  }

  render() {
    const { message, currentUser, recipient } = this.props

    const className = cx({
      'align-right': message.isAuthor,
      sending: message.isSending,
      error: message.isError,
      'with-gif': message.type === 'gif',
    })

    if (!recipient.photos) {
      Raven.captureMessage('recipient error', {
        level: 'error',
        extra: recipient,
      })
    }

    let avatar

    if (message.isAuthor) {
      avatar = recipient.photos ? recipient.photos[0].url : ''
    } else {
      avatar = currentUser.photos[0].url
    }

    return (
      <div
        styleName="wrapper"
        className={className}
        ref={ref => { this.wrapper = ref }}
        title={message.date}
      >
        <div styleName="avatar">
          <Link to={`users/${message.from}`} styleName="circle"><Img src={avatar} style={{ width: 40 }} /></Link>
          <span styleName="date">{moment(message.created_date).format('HH:mm')}</span>
        </div>
        <div styleName="message">
          {this.renderMessageContent()}
          {message.isSending && <i className="fa fa-envelope-open-o" />}
          {message.isError && <i className="fa fa-exclamation-triangle" />}
        </div>
      </div>
    );
  }
}
