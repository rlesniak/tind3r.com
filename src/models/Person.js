// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend'
import get from 'lodash/get'

import { miToKm } from 'Utils';

import type { SchoolType, InstagramType } from '../types/person';

class Person {
  store: any;
  birth_date: string;
  distance_mi: number;
  schools: ?Array<SchoolType>;
  instagram: ?InstagramType;

  @observable ping_time: Date;

  constructor(store: any, json: Object) {
    this.store = store;

    if (json) {
      extend(this, json);
    }
  }

  @computed get age(): string {
    return moment().diff(this.birth_date, 'years');
  }

  @computed get seenMin(): string {
    return moment(this.ping_time).fromNow();
  }

  @computed get school(): string {
    return get(this.schools, [0, 'name'], '')
  }

  @computed get distanceKm(): string {
    return `${miToKm(this.distance_mi)} KM`;
  }

  @computed get instagramProfileLink(): string {
    if (this.instagram && this.instagram.username) {
      return `https://www.instagram.com/${this.instagram.username}/`
    }

    return ''
  }

  @computed get instagramUsername(): string {
    return get(this.instagram, 'username', '');
  }
}

export default Person;
