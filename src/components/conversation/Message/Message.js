// @flow

import './Message.scss';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import Avatar from 'Components/Avatar';

import Message from 'models/Message';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';

type PropsTypes = {
  message: Message,
  author: Person | CurrentUser,
}

class MessageComponent extends Component {
  props: PropsTypes;

  wrapperRef: HTMLElement;

  scrollIntoView() {
    this.wrapperRef.scrollIntoView();
  }

  render() {
    const { message, author, onRemove } = this.props;

    return (
      <div
        ref={ref => { this.wrapperRef = ref}}
        className={cx('message', {
          'message__current': author.isCurrentUser,
          'message--sending': message.isSending,
          'message--error': message.isError,
        })}
      >
        <div className="message__avatar">
          <Link to={`users/${message.from_id}`}>
            <Avatar url={author.mainPhoto} />
          </Link>
        </div>
        <div className="message__body">
          {message.body}
          <button onClick={() => onRemove(message)}>X</button>
        </div>
      </div>
    );
  }
}

export default observer(MessageComponent);
