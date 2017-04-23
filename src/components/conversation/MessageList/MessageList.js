// @flow

import React from 'react';
import { observer, inject } from 'mobx-react';

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

const MessageList = ({ messageStore, currentUser }: PropsTypes) => (
  <div>
    {messageStore.messages.map(message =>
      <Message
        key={message._id}
        message={message}
        author={getAuthor(message.from_id, messageStore.interlocutor, currentUser)}
      />
    )}
  </div>
);

export default inject('currentUser')(observer(MessageList));
