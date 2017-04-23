// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import type { MessageType } from '../types/message';

class Message {
  id: string;
  store: Object;
  to_id: string;
  from_id: string;
  match_id: string;
  body: string;
  date: Date;

  constructor(store: Object, message: MessageType) {
    this.store = store;

    extend(this, message);
  }
}

export default Message;
