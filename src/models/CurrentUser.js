// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import get from 'lodash/get';

import API from 'utils/api';

import type { UserInterface } from 'types/userInterface';

type ResetAtHelperType = {
  formatted: ?string,
  seconds: number,
}

async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject();
  }
}
const formatSeconds = date => moment(date).diff(moment(), 'seconds');
const resetAtSeconds = (type: ?Date): number => (type ? formatSeconds(type) : -1);
const formatTime = date => moment.utc(moment(date).diff(moment())).format('HH:mm:ss');
const resetAtFormatted = (type: ?Date): string => (
  type && resetAtSeconds(type) > 0 ? formatTime(type) : ''
);

const resetAtDateHelper = (data): ResetAtHelperType => ({
  formatted: resetAtFormatted(data),
  seconds: resetAtSeconds(data),
});

export class CurrentUser implements UserInterface {
  name: string;
  isCurrentUser: true = true;

  @observable is_authenticated = undefined;
  @observable is_fetching: boolean = false;
  @observable is_error: boolean = false;
  @observable like_limit_reset: ?number = null;
  @observable superlike_limit_reset: ?string = null;
  @observable superlike_remaining: ?number = null;
  @observable _id: string;
  @observable full_name: string;
  @observable photos: ?[];

  @action set(json: Object) {
    if (json) {
      const { rating, user } = json;

      this.like_limit_reset = rating.rate_limited_until;
      this.superlike_limit_reset = rating.super_likes.resets_at;
      this.superlike_remaining = rating.super_likes.remaining;

      extend(this, user);
    }
  }

  @action fetch() {
    this.is_fetching = true;

    meta().then(data => {
      this.set(data);

      this.is_fetching = false;
      this.is_authenticated = true;
    }).catch(e => {
      console.log(e);
      this.is_authenticated = false;
      this.is_fetching = false;
      this.is_error = true;
    });
  }

  @computed get avatarUrl(): string {
    return get(this.photos, [0, 'url']);
  }

  @computed get likeResetDate(): ?Date {
    if (this.like_limit_reset) {
      return moment(this.like_limit_reset).format();
    }
    return null;
  }

  @computed get superlikeResetDate(): ?Date {
    if (this.superlike_limit_reset) {
      return moment(this.superlike_limit_reset).format();
    }
    return null;
  }

  @computed get likeReset(): ResetAtHelperType {
    return resetAtDateHelper(this.likeResetDate);
  }

  @computed get superlikeReset(): ResetAtHelperType {
    return resetAtDateHelper(this.superlikeResetDate);
  }

  @computed get mainPhoto(): string {
    return get(this.photos, [0, 'url']);
  }
}

export default new CurrentUser();
