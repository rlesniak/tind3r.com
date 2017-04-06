// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import API from 'Utils/api';
import * as Database from 'utils/database.v2';

class Match {
  id: string;
  store: Object;

  @observable is_fetched: boolean = false;
  @observable person: Object = {};
  @observable messages: [] = [];

  @action async setMatch(match: Object, interlocutor) {
    extend(this, match);

    this.person = interlocutor;
  }

  @action fetch() {
  }

  @computed get lastMessage(): Object {
    return last(this.messages) || {}
  }
}

export default Match;
