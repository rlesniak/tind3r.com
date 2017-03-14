// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend'
import get from 'lodash/get'

import { miToKm } from 'Utils';

import type { SchoolType, InstagramType, ActionsType } from '../types/person';

class Person {
  store: any;
  birth_date: string;
  distance_mi: number;
  schools: Array<SchoolType>;
  instagram: ?InstagramType;

  @observable ping_time: Date;
  @observable is_liked: boolean = false;

  constructor(store: Object, json: Object) {
    this.store = store;

    if (json) {
      extend(this, json);
    }
  }

  @action callAction(type: ActionsType) {
    this.is_liked = true;
  }

  @computed get age(): string {
    return moment().diff(this.birth_date, 'years');
  }

  @computed get seenMin(): string {
    return moment(this.ping_time).fromNow();
  }

  @computed get seen(): string {
    return moment(this.ping_time).format('DD/MM HH:mm')
  }

  @computed get school(): string {
    return get(this.schools, [0, 'name'], '')
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
