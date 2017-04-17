// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import last from 'lodash/last';
import get from 'lodash/get';

import API from 'Utils/api';
import Person from './Person';

import type { MatchType } from '../types/match';

class Match {
  _id: string;
  store: Object;

  @observable is_new: 0 | 1;
  @observable is_fetched: boolean = false;
  @observable person: Object = {};
  @observable messages: [] = [];
  @observable lastMessage = {};

  @action setMatch(match: MatchType) {
    extend(this, match);

    this.person = new Person(null, match.person);
  }

  @action create() {

  }

}

export default Match;
