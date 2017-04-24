// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import API from 'Utils/api';
import Person from './Person';
import { removeMatch } from 'Utils/database.v2';

import type { MatchType } from '../types/match';

class Match {
  _id: string;
  store: Object;
  last_activity_date: string;
  is_boost_match: boolean;
  is_super_like: boolean;
  is_new: boolean;

  @observable is_new: boolean = false;
  @observable is_fetched: boolean = false;
  @observable person: Object = {};
  @observable messages: [] = [];
  @observable last_message: Object = {};

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
}

export default Match;
