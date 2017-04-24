// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { last, uniqueId } from 'lodash';

import Message from '../Message';
import MessageStore from 'stores/MessageStore';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';

type PropsTypes = {
  messageStore: MessageStore,
  currentUser: CurrentUser,
};

type GetAuthorType = Person | CurrentUser;

const getAuthor = (fromId: string, interlocutor: Person, currentUser: CurrentUser): GetAuthorType => {
  return fromId === currentUser._id ? currentUser : interlocutor;
}

class MessageList extends Component {
  props: PropsTypes;

  messagesRefs: Array<*> = [];

  componentDidMount() {
    this.scrollIntoView()
  }

  componentDidUpdate() {
    this.scrollIntoView()
  }

  scrollIntoView() {
    const { messageStore, currentUser } = this.props;

    const lastMessage = last(this.messagesRefs);

    if (lastMessage) {
      lastMessage.scrollIntoView()
    }
  }

  render() {
    const { messageStore, currentUser } = this.props;

    return (
      <div>
        {messageStore.messages.map(message =>
          <Message
            key={message._id || uniqueId()}
            ref={ref => { this.messagesRefs.push(ref) }}
            message={message}
            author={getAuthor(message.from_id, messageStore.interlocutor, currentUser)}
          />
        )}
      </div>
    )
  }
}

export default inject('currentUser')(observer(MessageList));
