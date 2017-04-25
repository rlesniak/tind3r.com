// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import API from 'Utils/api';
import Person from './Person';
import Message from './Message';
import { removeMatch } from 'Utils/database.v2';

import MessageStore from '../stores/MessageStore';

import type { MatchType } from '../types/match';
import type { MessageType } from '../types/message';

class Match {
  _id: string;
  store: Object;
  last_activity_date: string;
  is_boost_match: boolean;
  is_super_like: boolean;
  is_new: boolean;
  last_msg_from_db: MessageType;

  @observable messageStore: ?MessageStore;
  @observable is_new: boolean = false;
  @observable is_fetched: boolean = false;
  @observable person: Object = {};
  @observable messages: [] = [];

  constructor(store: Object) {
    this.store = store;
  }

  @action setMatch(match: MatchType) {
    extend(this, match);

    this.person = new Person({}, match.person);
  }

  @action create() {

  }

  @action remove() {
    removeMatch(this._id);

    this.store.items.remove(this);
  }

  @action setMessageStore(store: MessageStore) {
    this.messageStore = store;
  }

  @computed get lastMessage(): Message {
    let message: Message;

    if (this.messageStore && this.messageStore.lastMessage) {
      message = this.messageStore.lastMessage;
    } else {
      message = new Message(this, this.last_msg_from_db);
    }

    return message;
  }

  @computed get lastActivity(): moment {
    let date = this.last_activity_date

    if (this.lastMessage.date) {
      date = this.lastMessage.date;
    }

    return moment(date);
  }
}

export default Match;
