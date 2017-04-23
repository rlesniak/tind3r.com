// @flow

import React from 'react';
import { observer } from 'mobx-react';

const Message = ({ message, author }) => (
  <div>{message.body}</div>
);

export default observer(Message);
