// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import FetchService from 'services/fetch-service';

import type { MessageType } from '../types/message';

class Message {
  @observable _id: string;
  @observable body: string;
  @observable date: string;
  @observable isSending: boolean = false;
  @observable isError: boolean = false;

  store: ?Object;
  to_id: ?string;
  from_id: string;
  match_id: string;

  constructor(store: Object, message: MessageType) {
    this.store = store;

    extend(this, message);
  }

  @action async save() {
    this.isSending = true;
    try {
      const data = await FetchService.sendMessage(this.match_id, this.body);

      extend(this, data);
    } catch(err) {
      this.isError = true;
    }

    this.isSending = false;
  }

  @computed get sendDate(): moment {
    return moment(this.date);
  }
}

export default Message;
