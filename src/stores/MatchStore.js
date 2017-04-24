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

const saveCollectionToDb = data =>{
  const collection = DB().collection('matches');
  collection.insert(data);
  collection.save();
}

export class MatchStore {
  @observable is_sync = false;
  @observable isLoading = false;
  @observable items: Array<Match> = [];

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
    this.isLoading = true;

    try {
      const { matches } = await FetchService.updates();

      setTimeout(() => this.getFromDb(), 0);
    } catch(err) { console.log(err) }

    this.isLoading = false;
  }

  @action create(data: MatchType): void {
    if (this.items.find(el => el._id === data._id)) {
      return
    }

    const match: Match = new Match(this);
    match.setMatch(data)

    this.items.push(match);
  }

  @computed get unreadCount(): number {
    return this.matches.filter(match => match.is_new).length;
  }

  @computed get matches(): Array<Match> {
    return this.items.reverse();
  }
}

export default new MatchStore();
