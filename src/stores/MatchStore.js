// @flow

import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';
import includes from 'lodash/includes';
import orderBy from 'lodash/orderBy';

import { get } from 'utils/api';
import Match from 'models/Match';
import DB from 'utils/database.v2';
import FetchService from 'services/fetch-service';
import database, { matchCollection } from 'utils/database.v2';

import type { MatchType, FiltersType } from 'types/match';

const saveCollectionToDb = data =>{
  const collection = DB().collection('matches');
  collection.insert(data);
  collection.save();
}

export const FILTER_TYPES: { [string]: FiltersType } = {
  ALL: 'all',
  NEW: 'new',
  UNREAD: 'unread',
  UNANSWERED: 'unanswered',
  BLOCKED: 'blocked',
}

export class MatchStore {
  @observable is_sync = false;
  @observable isLoading = false;
  @observable items: Array<Match> = [];

  @observable filter = '';

  @observable visibilityFilter: FiltersType = 'all';

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
        // console.log(data)
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
    let data = this.items.filter(m => {
      return m.person.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
    });

    switch(this.visibilityFilter) {
      case FILTER_TYPES.UNREAD: data = this.filterUnread(data); break;
      case FILTER_TYPES.NEW: data = this.filterNew(data); break;
      case FILTER_TYPES.UNANSWERED: data = this.filterUnanswered(data); break;
      case FILTER_TYPES.BLOCKED: data = this.filterBlocked(data); break;
    }

    return data;
  }

  @computed get size(): { all: number, new: number, unread: number, unaswered: number } {
    return {
      all: this.items.length,
      new: this.filterNew(this.items).length,
      unread: this.filterUnread(this.items).length,
      unaswered: this.filterUnanswered(this.items).length,
      blocked: this.filterBlocked(this.items).length,
    }
  }

  filterNew(data: Array<Match>) {
    return data.filter(m => m.is_new && !m.lastMessage.body)
  }

  filterUnread(data: Array<Match>) {
    return data.filter(m => m.is_new && m.lastMessage.body)
  }

  filterUnanswered(data: Array<Match>) {
    return data.filter(m => m.is_new && !m.lastMessage.body)
  }

  filterBlocked(data: Array<Match>) {
    return data.filter(m => m.is_blocked)
  }

  find(matchId: string): Match {
    return this.items.find(item => item._id === matchId);
  }
}

export default new MatchStore();
