// @flow

import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';

import { get } from 'Utils/api';
import Match from '../models/Match';
import database, { matchCollection } from 'utils/database.v2';
import FetchService from 'services/fetch-service';
import DB from '../utils/database.v2';

import type { MatchType } from '../types/match';
import type { MatchModelType } from '../models/Match';

export type MatchStoreType = {
  items: Array<*>,
  fetch: () => void,
  matches: () => Array<MatchModelType>,
}

const saveCollectionToDb = data =>{
  const collection = DB().collection('matches');
  collection.insert(data);
  collection.save();
}

class MatchStore {
  @observable is_sync = false;
  @observable items: Array<Object> = [];

  constructor() {
    DB().collection('matches').on('update', () => {
      console.log('updated');
    });
  }

  @action getFromDb() {
    const matches = matchCollection();

    matches.forEach(action(data => {
      this.create(data);
    }));

    this.is_sync = true;
  }

  @action async fetch() {
    try {
      const { matches } = await FetchService.updates();

      setTimeout(() => this.getFromDb(), 0);
    } catch(err) { console.log(err) }
  }

  @action create(data: MatchType) {
    if (this.items.find(el => el._id === data._id)) {
      return
    }

    const match = new Match(this);
    match.setMatch(data)

    this.items.push(match);
  }

  @computed get unreadCount(): number {
    return this.matches.filter(match => match.is_new).length;
  }

  @computed get matches(): MatchModelType[] {
    return this.items.reverse();
  }
}

export default new MatchStore();
