// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import get from 'lodash/get';
import find from 'lodash/find';

import { miToKm, kmToMi } from 'utils';
import API from 'utils/api';
import FetchSevice from 'services/fetch-service';

import type { UserInterface } from 'types/userInterface';

type ResetAtHelperType = {
  formatted: ?string,
  seconds: number,
}

const PROFILE_FIELDS = [
  'discoverable', 'gender_filter', 'age_filter_min', 'age_filter_max',
  'distance_filter', 'squads_discoverable',
];

async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    if (process.env.NODE_ENV === 'production') {
      Bugsnag.notifyException(e, 'meta()');
    }
    return Promise.reject(e);
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

export const MAX_DISTANCE = 160;
export const MAX_AGE = 50;
export const MIN_AGE = 18;

export class CurrentUser implements UserInterface {
  name: string;
  isCurrentUser: true = true;

  @observable isProcessing: boolean = false;
  @observable is_authenticated: ?boolean = undefined;
  @observable is_fetching: boolean = false;
  @observable is_error: boolean = false;
  @observable like_limit_reset: ?number = null;
  @observable superlike_limit_reset: ?string = null;
  @observable superlike_remaining: ?number = null;
  @observable _id: string;
  @observable full_name: string;
  @observable bio: string;
  @observable photos: ?[];
  @observable distance_filter: number;
  @observable age_filter_min: number;
  @observable age_filter_max: number;
  @observable plusAccount: boolean;

  @action set(json: Object) {
    const { rating, user, purchases } = json;

    if (user) {
      extend(this, user);
    }

    if (purchases) {
      this.plusAccount = !!find(purchases, p => p.product_type === 'plus');
    }

    if (rating) {
      this.like_limit_reset = rating.rate_limited_until;
      this.superlike_limit_reset = rating.super_likes.resets_at;
      this.superlike_remaining = rating.super_likes.remaining;
    }
  }

  @action fetch() {
    this.is_fetching = true;

    meta().then(data => {
      this.set(data);

      this.is_fetching = false;
      this.is_authenticated = true;
    }).catch(e => {
      this.is_authenticated = false;
      this.is_fetching = false;
      this.is_error = true;
    });
  }

  @action async updateProfile(payload: Object) {
    const distance = payload.distance_filter || this.profileSettings.distance_filter;

    this.isProcessing = true;

    try {
      const { data } = await FetchSevice.updateProfile({
        ...this.profileSettings,
        ...payload,
        distance_filter: kmToMi(distance),
      });

      this.set(data);
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        Bugsnag.notifyException(e, 'updateProfile()');
      }
    }

    this.isProcessing = false;
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

  @computed get profileSettings(): Object {
    return pick(this, PROFILE_FIELDS);
  }

  @computed get distanceKm(): number {
    return miToKm(this.distance_filter);
  }
}

export default new CurrentUser();
