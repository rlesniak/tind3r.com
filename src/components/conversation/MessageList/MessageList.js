// @flow

import React from 'react';
import { observer } from 'mobx-react';

import Message from '../Message';

const MessageList = ({ messageStore }) => (
  <div>
    {messageStore.messages.map(m =>
      <Message key={m._id} message={m} author={messageStore.interlocutor} />
    )}
  </div>
);

export default observer(MessageList);
