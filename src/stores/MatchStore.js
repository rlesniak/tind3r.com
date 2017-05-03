// @flow

import { observable, computed, action } from 'mobx';
import orderBy from 'lodash/orderBy';
import each from 'lodash/each';

import Match from 'models/Match';
import DB, { matchCollection } from 'utils/database.v2';
import FetchService from 'services/fetch-service';

import type { MatchType, FiltersType } from 'types/match';

export const FILTER_TYPES: { [string]: FiltersType } = {
  ALL: 'all',
  NEW: 'new',
  UNREAD: 'unread',
  UNANSWERED: 'unanswered',
  BLOCKED: 'blocked',
};

export class MatchStore {
  current_user_id: string;

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
      each(data, message => {
        const match = this.find(message.match_id);
        if (match) match.insertNewMessage(message);
      });
    });
  }

  setCurrentUserId(id: string) {
    this.current_user_id = id;
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
      const { matches } = await FetchService.updates(); // eslint-disable-line

      setTimeout(() => {
        this.getFromDb();
        this.isLoading = false;
      }, 100);
    } catch (err) { console.log(err); }
  }

  @action create(data: MatchType): void {
    if (this.items.find(el => el._id === data._id)) {
      return;
    }

    const match: Match = new Match(this);
    match.setMatch(data);

    this.items.push(match);
  }

  @action setFilter(value: string) {
    this.filter = value;
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
    let data = this.items.filter(m => m.person.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1);

    switch (this.visibilityFilter) {
      case FILTER_TYPES.UNREAD: data = this.filterUnread; break;
      case FILTER_TYPES.NEW: data = this.filterNew; break;
      case FILTER_TYPES.UNANSWERED: data = this.filterUnanswered; break;
      case FILTER_TYPES.BLOCKED: data = this.filterBlocked; break;
    }

    return data;
  }

  @computed get size(): { all: number, new: number, unread: number, unaswered: number } {
    return {
      all: this.items.length,
      new: this.filterNew.length,
      unread: this.filterUnread.length,
      unaswered: this.filterUnanswered.length,
      blocked: this.filterBlocked.length,
    };
  }

  @computed get filterNew() {
    return this.items.filter(m => m.is_new && !m.lastMessage.body);
  }

  @computed get filterUnread() {
    return this.items.filter(m => m.is_new && m.lastMessage.body);
  }

  @computed get filterUnanswered() {
    return this.items.filter(m => (
      m.lastMessage && m.lastMessage.body && m.lastMessage.from_id === this.current_user_id
    ));
  }

  @computed get filterBlocked() {
    return this.items.filter(m => m.is_blocked);
  }

  find(matchId: string): ?Match {
    return this.items.find(item => item._id === matchId);
  }
}

export default new MatchStore();
