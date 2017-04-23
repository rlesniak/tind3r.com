// @flow

import React from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';

import Message from 'models/Message';
import Person from 'models/Person';
import { CurrentUser } from 'models/CurrentUser';

type PropsTypes = {
  message: Message,
  author: Person | CurrentUser,
}

const MessageComponent = ({ message, author }: PropsTypes) => (
  <div
    className={cx('message', {
      'message__current': author.isCurrentUser,
    })}
  >
    {message.body} {author.name} {author.isCurrentUser ? 't' : 'n'}
  </div>
);

export default observer(MessageComponent);
