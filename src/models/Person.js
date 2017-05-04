// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import get from 'lodash/get';
import noop from 'lodash/noop';

import { miToKm } from 'utils';
import API from 'utils/api';
import { ACTION_TYPES } from 'const';
import { pass, like, superlike } from 'services/person-actions';
import { createAction, createMatch, updatePerson } from 'utils/database.v2';

import type { SchoolType, InstagramType, ActionsType } from 'types/person';
import type { UserInterface } from 'types/userInterface';

class Person implements UserInterface {
  isCurrentUser: false = false;

  _id: string;
  store: any;
  birth_date: string;
  schools: Array<SchoolType>;
  instagram: ?InstagramType;
  photos: ?[];
  name: string;
  bio: string;

  @observable distance_mi: number;
  @observable is_loading: boolean = false;
  @observable ping_time: Date;
  @observable is_liked: boolean = false;
  @observable is_super_like: boolean = false;
  @observable is_done: number = 0;
  @observable like_limit_reset: ?string = null;
  @observable superlike_limit_reset: ?string = null;

  constructor(store: Object, json: ?Object) {
    this.store = store;

    if (json) {
      extend(this, json);
    }
  }

  createDBAction(type: string) {
    createAction({
      person_id: this._id,
      action_type: type,
      date: moment().format(),
    });
  }

  createDBMatch(match: Object) {
    createMatch(match);
  }

  @action async fetch() {
    this.is_loading = true;

    try {
      const { data } = await API.get(`/user/${this._id}`);

      extend(this, data.results);
      updatePerson(this._id, data.results);
    } catch (e) {
    }

    this.is_loading = false;
  }

  @action async callAction(
    type: ActionsType,
    superlikeCallback: (remaining: number) => void = noop,
    matchCallback: (data?: Object) => void = noop,
    errorCallback: (reason: Object) => void = noop,
  ) {
    this.is_done = 1;

    switch (type) {
      case ACTION_TYPES.PASS:
        try {
          const data = await pass(this._id);
          this.createDBAction('pass');
        } catch (e) {}
        break;
      case ACTION_TYPES.LIKE:
        try {
          const { match } = await like(this._id);
          if (match) {
            matchCallback();
            this.createDBMatch(match);
          }

          this.createDBAction('like');
        } catch (e) {
          if (e.error) {
            errorCallback({ type: 'like', resetsAt: e.resetsAt });
          }

          this.is_done = 0;
        }
        break;
      case ACTION_TYPES.SUPERLIKE:
        try {
          const { match, super_likes: { remaining } } = superlike(this._id);
          if (match) {
            matchCallback();
            this.createDBMatch(match);
          }

          this.createDBAction('superlike');
          superlikeCallback(remaining);
        } catch (e) {
          if (e.error) {
            errorCallback({ type: 'superlike', resetsAt: e.resetsAt });
          }

          this.is_done = 0;
        }
    }
  }

  @computed get age(): string {
    return moment().diff(this.birth_date, 'years');
  }

  @computed get seenMin(): string {
    return moment(this.ping_time).fromNow();
  }

  @computed get seen(): string {
    return moment(this.ping_time).format('DD/MM HH:mm');
  }

  @computed get school(): string {
    return get(this.schools, [0, 'name'], '');
  }

  @computed get distanceKm(): ?string {
    if (this.distance_mi) {
      return `${miToKm(this.distance_mi)} KM`;
    }

    return null;
  }

  @computed get instagramProfileLink(): string {
    if (this.instagramUsername) {
      return `https://www.instagram.com/${this.instagramUsername}/`;
    }

    return '';
  }

  @computed get instagramUsername(): string {
    return get(this.instagram, 'username', '');
  }

  @computed get isLiked(): boolean {
    return this.is_liked;
  }

  @computed get mainPhoto(): string {
    return get(this.photos, [0, 'url']);
  }

  @computed get toJSON() {
    return {
      _id: this._id,
      name: this.name,
      birth_date: this.birth_date,
      photos: this.photos,
      bio: this.bio,
      distance_mi: this.distance_mi,
      schools: this.schools,
      is_liked: this.is_liked,
      is_super_like: this.is_super_like,
    };
  }
}

export default Person;
