// @flow

import { observable, computed, action } from 'mobx';
import orderBy from 'lodash/orderBy';
import each from 'lodash/each';
import LogRocket from 'logrocket';

import Match from 'models/Match';
import { collections, matchCollection, updateMatch } from 'utils/database.v2';
import FetchService from 'services/fetch-service';
import counterService from 'services/counterService';

import type { MatchType, FiltersType } from 'types/match';

export const FILTER_TYPES: { [string]: FiltersType } = {
  ALL: 'all',
  NEW: 'new',
  UNREAD: 'unread',
  UNANSWERED: 'unanswered',
  BLOCKED: 'blocked',
  SUPERLIKE: 'superlike',
};

export class MatchStore {
  current_user_id: string;

  @observable is_sync = false;
  @observable isLoading = false;
  @observable items: Array<Match> = [];

  @observable filter = '';

  @observable visibilityFilter: FiltersType = 'all';

  constructor() {
    collections.matches.on('update', (data) => {
      each(data, (item: MatchType) => {
        const match = this.find(item._id);
        if (match) match.updateMatch(item);
      });
    });

    collections.messages.on('insert', (data) => {
      each(data, (message) => {
        const match = this.find(message.match_id);
        if (match) match.insertNewMessage(message);
      });
    });
  }

  initUpdater(errorCallback: () => void) {
    counterService.subscribe({
      handler: this.fetch.bind(this, errorCallback),
      id: 'updater',
      isBusyHandler: this.checkIsLoading.bind(this),
      delay: 2000,
    });
  }

  destroyUpdater() {
    counterService.unsubscribe('updater');
  }

  setCurrentUserId(id: string) {
    this.current_user_id = id;
  }

  checkIsLoading(): boolean {
    return this.isLoading;
  }

  @action getFromDb() {
    const matches = matchCollection();
    matches.forEach(action((data) => {
      this.create(data);
    }));

    this.is_sync = true;
  }

  @action async fetch(errorCallback: () => void) {
    this.isLoading = true;

    try {
      const { matches, messages } = await FetchService.updates(); // eslint-disable-line

      if (matches.length || messages.length) {
        this.getFromDb();
      }

      this.isLoading = false;
    } catch (err) {
      LogRocket.error('fetch', err);

      if (err && window.Bugsnag) {
        Bugsnag.notifyException(err);
      }

      if (err.type) {
        if (window.Bugsnag) {
          Bugsnag.notifyException(new Error('dbError'), 'fetch()', { type: err.type, data: err.data, size: err.size });
        }

        if (window.hj) {
          window.hj('tagRecording', ['With error']);
        }
      } else if (typeof errorCallback === 'function') errorCallback();
      this.isLoading = false;
    }
  }

  @action markAllAsRead(): void {
    const unreadIds = this.items.filter(match => match.isUnread).map(match => match._id);
    updateMatch(unreadIds, { is_new: false });
  }

  @action removeAllBlocked(): string[] {
    const removedIds = [];

    this.items.slice(0).forEach((match) => {
      if (match.is_blocked) {
        this.remove(match);
        removedIds.push(match._id);
      }
    });

    return removedIds;
  }

  @action create(data: MatchType): void {
    if (this.items.find(el => el._id === data._id)) {
      return;
    }

    const match: Match = new Match(this);
    match.setMatch(data);

    this.items.push(match);
  }

  @action remove(match: Match) {
    this.items.remove(match);
  }

  @action setFilter(value: string) {
    this.filter = value;
  }

  @computed get unreadCount(): number {
    return this.items.filter(match => match.isUnread).length;
  }

  @computed get blockedCount(): number {
    return this.items.filter(match => match.is_blocked).length;
  }

  @computed get matches(): Array<Match> {
    return orderBy(this.getFiltered, match => (
      match.lastActivity.format('X')
    ), 'desc');
  }

  @computed get getFiltered(): Array<Match> {
    let data = this.items;

    switch (this.visibilityFilter) {
      case FILTER_TYPES.UNREAD: data = this.filterUnread; break;
      case FILTER_TYPES.NEW: data = this.filterNew; break;
      case FILTER_TYPES.UNANSWERED: data = this.filterUnanswered; break;
      case FILTER_TYPES.BLOCKED: data = this.filterBlocked; break;
      case FILTER_TYPES.SUPERLIKE: data = this.filterSuperlike; break;
    }

    data = data.filter((m) => {
      if (!m.person.name) {
        if (window.Bugsnag) {
          Bugsnag.notifyException(new Error('!m.person.name'), m.person);
        }

        LogRocket.warn('person.name', m.person);

        return true;
      }
      return m.person.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
    });

    return data;
  }

  @computed get size(): { all: number, new: number, unread: number, unaswered: number, superlike: number } {
    return {
      all: this.items.length,
      new: this.filterNew.length,
      unread: this.filterUnread.length,
      unaswered: this.filterUnanswered.length,
      blocked: this.filterBlocked.length,
      superlike: this.filterSuperlike.length,
    };
  }

  @computed get filterNew() {
    return this.items.filter(m => m.isUnread && !m.lastMessage.body);
  }

  @computed get filterUnread() {
    return this.items.filter(m => m.isUnread && m.lastMessage.body);
  }

  @computed get filterUnanswered() {
    return this.items.filter(m => (
      m.lastMessage && m.lastMessage.body && m.lastMessage.from_id !== this.current_user_id
    ));
  }

  @computed get filterBlocked() {
    return this.items.filter(m => m.is_blocked);
  }

  @computed get filterSuperlike() {
    return this.filterTypes(FILTER_TYPES.SUPERLIKE);
  }

  filterTypes(type: string) {
    return this.items.filter((m) => {
      switch (type) {
        case FILTER_TYPES.SUPERLIKE: return m.is_super_like;
      }

      return false;
    });
  }

  find(matchId: string): ?Match {
    return this.items.find(item => item._id === matchId);
  }
}

export default new MatchStore();
