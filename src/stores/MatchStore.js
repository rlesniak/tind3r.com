// @flow

import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';

import { get } from 'Utils/api';
import * as Database from 'utils/database.v2';

export type MatchStoreType = {
  matches: Array<*>,
  fetch: () => void,
}

class MatchStore {
  @observable matches = [];

  @action async fetch() {
    this.matches = await Database.getMatches();
  }
}

export default new MatchStore();
