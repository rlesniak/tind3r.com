// @flow

import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';

import { get } from 'utils/api';
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

  @observable filter = '';

  constructor() {
    DB().collection('matches').on('update', data => {
      const [item]: MatchType = data;
      const match = this.find(item._id);

      if (match) match.updateMatch(item);
    });

    DB().collection('messages').on('insert', data => {
      const [item]: MatchType = data;

      if (item) {
        const match = this.find(item.match_id);
        console.log(data)
        if (match) match.insertNewMessage(item);
      }
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

      setTimeout(() => {
        this.getFromDb();
        this.isLoading = false;
      }, 100);
    } catch(err) { console.log(err) }
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
    return orderBy(this.getFiltered, match => (
      match.lastActivity.format('X')
    ), 'desc');
  }

  @computed get getFiltered(): Array<Match> {
    return this.items.filter(m => {
      return m.person.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
    })
  }

  find(matchId: string): Match {
    return this.items.find(item => item._id === matchId);
  }
}

export default new MatchStore();
