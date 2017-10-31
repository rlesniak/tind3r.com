// @flow

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import Avatar from 'components/Avatar';

import Message from 'models/Message';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';

import './Message.scss';

type PropsType = {
  message: Message,
  author: Person | CurrentUser,
  group: boolean,
  onRemove: () => void,
  todayDate: moment,
}

class MessageComponent extends Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  props: PropsType;
  wrapperRef: HTMLElement;

  scrollIntoView() {
    this.wrapperRef.scrollIntoView();
  }

  renderMessageContent() {
    const { message } = this.props;

    if (message.body.indexOf('giphy.com') > -1) {
      return <div className="message__gif"><img src={message.body} alt="gif" /></div>;
    }

    return message.body.split('\n').map((item, key) => (
      <span key={key}>{item}<br /></span>
    ));
  }

  render() {
    const { message, author, group, todayDate } = this.props;
    const messageDate = moment(message.date);
    const messageDiff = todayDate.diff(messageDate, 'd');
    const dateFormat = messageDiff > 0 ? 'DD/MM' : 'HH:mm';
    let tipProps = {};

    if (messageDiff > 0) {
      tipProps = {
        'data-tip': messageDate.format('DD/MM HH:mm'),
      };
    }

    return (
      <div
        ref={(ref) => { this.wrapperRef = ref; }}
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
          <div className="message__date">{messageDate.format(dateFormat)}</div>
        </div>}
        <div className="message__body" data-for="main" {...tipProps}>
          {this.renderMessageContent()}
          {/* <button onClick={() => onRemove(message)}>X</button> */}
        </div>
      </div>
    );
  }
}

export default observer(MessageComponent);
