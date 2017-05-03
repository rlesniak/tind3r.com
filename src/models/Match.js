// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';

import { removeMatch, updateMatch } from 'utils/database.v2';
import FetchService from 'services/fetch-service';
import MessageStore from 'stores/MessageStore';

import Person from './Person';
import Message from './Message';

import type { MatchType } from 'types/match';
import type { MessageType } from 'types/message';

class Match {
  _id: string;
  store: Object;
  last_activity_date: string;
  is_boost_match: boolean;
  is_super_like: boolean;
  is_new: boolean;

  @observable is_blocked: boolean = false;
  @observable last_msg_from_db: MessageType;
  @observable messageStore: ?MessageStore;
  @observable is_new: boolean = false;
  @observable is_fetched: boolean = false;
  @observable person: Person | Object = {};
  @observable messages: [] = [];

  constructor(store: Object) {
    this.store = store;
  }

  @action setMatch(match: MatchType) {
    extend(this, match);

    this.person = new Person({}, match.person);
  }

  @action updateMatch(match: MatchType) {
    extend(this, match);
  }

  @action create() {

  }

  @action remove() {
    removeMatch(this._id);

    this.store.items.remove(this);
  }

  @action async unmatch() {
    this.is_blocked = true;

    try {
      const blocked = await FetchService.block(this._id); // eslint-disable-line

      updateMatch(this._id, { is_blocked: 1 });
    } catch (err) {
      this.is_blocked = false;
    }
  }

  @action setMessageStore(store: MessageStore) {
    this.messageStore = store;
  }

  @action setAsRead() {
    updateMatch(this._id, { is_new: false });
  }

  @action insertNewMessage(data: MessageType) {
    if (this.messageStore) {
      this.messageStore.create(data);
    } else {
      this.last_msg_from_db = data;
    }
  }

  @computed get lastMessage(): Message {
    if (this.messageStore && this.messageStore.lastMessage) {
      return this.messageStore.lastMessage;
    }

    return new Message(this, this.last_msg_from_db);
  }

  @computed get lastActivity(): moment {
    let date = this.last_activity_date;

    if (this.lastMessage.date) {
      date = this.lastMessage.date;
    }

    return moment(date);
  }
}

export default Match;
