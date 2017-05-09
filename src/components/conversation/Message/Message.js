// @flow

import './Message.scss';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Avatar from 'components/Avatar';

import Message from 'models/Message';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';

type PropsType = {
  message: Message,
  author: Person | CurrentUser,
  group: boolean,
  onRemove: () => void,
}

class MessageComponent extends Component {
  props: PropsType;

  wrapperRef: HTMLElement;

  scrollIntoView() {
    this.wrapperRef.scrollIntoView();
  }

  renderMessageContent() {
    const { message } = this.props

    if (message.body.indexOf('giphy.com') > -1) {
      return <div className="message__gif"><img src={message.body} alt="gif" /></div>
    }

    return message.body;
  }

  render() {
    const { message, author, onRemove, group } = this.props;

    return (
      <div
        ref={ref => { this.wrapperRef = ref; }}
        className={cx('message', {
          message__current: author.isCurrentUser,
          'message--sending': message.isSending,
          'message--error': message.isError,
          'message--grouped': group,
        })}
      >
        {!group && <div className="message__avatar">
          <Link to={`users/${message.from_id}`}>
            <Avatar width={40} height={40} url={author.mainPhoto} />
          </Link>
          <div className="message__date">{moment(message.date).format('HH:mm')}</div>
        </div>}
        <div className="message__body">
          {this.renderMessageContent()}
          {/*<button onClick={() => onRemove(message)}>X</button>*/}
        </div>
      </div>
    );
  }
}

export default observer(MessageComponent);
