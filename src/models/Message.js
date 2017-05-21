// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';

import FetchService from 'services/fetch-service';

import type { MessageType } from 'types/message';

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

  @action async save(payload: Object = {}) {
    this.isSending = true;
    try {
      const data = await FetchService.sendMessage(this.match_id, this.body, payload);

      extend(this, data);
    } catch (err) {
      this.isError = true;
    }

    this.isSending = false;
  }

  @computed get sendDate(): moment {
    return moment(this.date);
  }
}

export default Message;
