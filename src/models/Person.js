// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import get from 'lodash/get';
import noop from 'lodash/noop';

import { miToKm } from 'Utils';

import { pass, like, superlike } from 'services/person-actions';
import { ACTION_TYPES } from 'const';

import type { SchoolType, InstagramType, ActionsType } from '../types/person';

class Person {
  store: any;
  _id: string;
  birth_date: string;
  distance_mi: number;
  schools: Array<SchoolType>;
  instagram: ?InstagramType;

  @observable is_loading: boolean = false;
  @observable ping_time: Date;
  @observable is_liked: boolean = false;
  @observable is_done: number = 0;
  @observable like_limit_reset: ?string = null;
  @observable superlike_limit_reset: ?string = null;

  constructor(store: Object, json: Object) {
    this.store = store;

    if (json) {
      extend(this, json);
    }
  }

  @action callAction(
    type: ActionsType,
    superlikeCallback: (remaining: number) => void = noop,
    matchCallback: (data?: Object) => void = noop,
    errorCallback: (reason: Object) => void = noop,
  ) {
    this.is_done = 1;

    switch(type) {
      case ACTION_TYPES.PASS:
        pass(this._id)
          .catch(() => {
            setTimeout(() => this.is_done = 0, 500);
          });
        break;
      case ACTION_TYPES.LIKE:

      let resp ={};
        // like(this._id).
          // then(data => {
          //   if (data.match) {
          //     matchCallback();
          //   }
          // }).catch(resp => {
            // if (resp.error) {
              resp.resetsAt = new Date().getTime() + 8000;

              errorCallback({ type: 'like', resetsAt: resp.resetsAt })
            // }

            this.is_done = 0;
          // });
        break;
      case ACTION_TYPES.SUPERLIKE:
        superlike(this._id).
          then(data => {
            if (data.match) {
              matchCallback();
            }
            superlikeCallback(data.super_likes.remaining)
          }).catch(resp => {
            if (resp.error) {
              errorCallback({ type: 'superlike', resetsAt: resp.resetsAt })
            }

            this.is_done = 0;
          });
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

  @computed get distanceKm(): string {
    return `${miToKm(this.distance_mi)} KM`;
  }

  @computed get instagramProfileLink(): string {
    if (this.instagram && this.instagram.username) {
      return `https://www.instagram.com/${this.instagram.username}/`;
    }

    return '';
  }

  @computed get instagramUsername(): string {
    return get(this.instagram, 'username', '');
  }

  @computed get isLiked(): boolean {
    return this.is_liked;
  }
}

export default Person;
