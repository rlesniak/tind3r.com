// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { last } from 'lodash';
import moment from 'moment';

import MessageStore from 'stores/MessageStore';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';
import Message from '../Message';

type PropsType = {
  messageStore: MessageStore,
  currentUser: CurrentUser,
};

type GetAuthorType = Person | CurrentUser;

const getAuthor = (fromId: string, interlocutor: Person, currentUser: CurrentUser): GetAuthorType => (
  fromId === currentUser._id ? currentUser : interlocutor
);

class MessageList extends Component {
  componentDidMount() {
    this.scrollIntoView();
  }

  componentDidUpdate() {
    this.scrollIntoView();
  }

  props: PropsType;

  messagesRefs: Array<*> = [];

  scrollIntoView() {
    const lastMessage = last(this.messagesRefs);

    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  }

  render() {
    const { messageStore, currentUser } = this.props;
    const todayDate = moment();
    let gorupMessage = false;

    return (
      <div>
        {messageStore.messages.map((message, i) => {
          const component = (
            <Message
              group={gorupMessage}
              key={message._id}
              ref={(ref) => { this.messagesRefs.push(ref); }}
              message={message}
              todayDate={todayDate}
              onRemove={messageStore.removeMessage}
              author={getAuthor(message.from_id, messageStore.interlocutor, currentUser)}
            />
          );

          if (i < messageStore.messages.length - 1) {
            const next = messageStore.messages[i + 1];
            const firstTime = message.sendDate;
            const nextTime = next.sendDate;
            const dur = moment.duration(nextTime.diff(firstTime));
            if (dur.asMinutes() < 1 && message.from_id === next.from_id) {
              gorupMessage = true;
            } else {
              gorupMessage = false;
            }
          }

          return component;
        },
        )}
      </div>
    );
  }
}

export default inject('currentUser')(observer(MessageList));
