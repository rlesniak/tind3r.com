import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend'
import get from 'lodash/get'

import { miToKm } from 'Utils';

class Person {
  @observable ping_time;

  constructor(store, json) {
    this.store = store;

    if (json) {
      extend(this, json);
    }
  }

  @computed get age() {
    return moment().diff(this.birth_date, 'years');
  }

  @computed get seenMin() {
    return moment(this.ping_time).fromNow();
  }

  @computed get school() {
    return get(this.schools, [0, 'name'])
  }

  @computed get distanceKm() {
    return `${miToKm(this.distance_mi)} KM`;
  }

  @computed get instagramProfileLink() {
    if (this.instagram && this.instagram.username) {
      return `https://www.instagram.com/${this.instagram.username}/`
    }

    return null
  }

  @computed get instagramUsername() {
    return get(this.instagram, 'username');
  }
}

export default Person;
