// @flow

import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';

import { get } from 'Utils/api';
import Match from '../models/Match';
import database, { matchCollection, fetchFromRemote } from 'utils/database.v2';

import type { MatchType } from '../types/match';

export type MatchStoreType = {
  matches: Array<*>,
  fetch: () => void,
}

class MatchStore {
  @observable matches = [];

  @action async fetch() {
    fetchFromRemote()
    const matches: Array<MatchType> = await matchCollection();

    matches.forEach(action(data => {
      const match = new Match;
      match.setMatch(data);
      this.matches.push(match);
    }));
  }

  @action create(data: MatchType) {
    const match = new Match();
    match.setMatch(data)

    this.matches.push(match);
  }
}

export default new MatchStore();
