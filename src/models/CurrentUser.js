// @flow

import { observable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import pick from 'lodash/pick';
import get from 'lodash/get';
import find from 'lodash/find';
import each from 'lodash/each';

import { miToKm } from 'utils';
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
    return Promise.reject(e);
  }
}
const formatSeconds = date => moment(date).diff(moment(), 'seconds');
const resetAtSeconds = (type: ?string): number => (type ? formatSeconds(type) : -1);
const formatTime = date => moment.utc(moment(date).diff(moment())).format('HH:mm:ss');
const resetAtFormatted = (type: ?string): string => (
  type && resetAtSeconds(type) > 0 ? formatTime(type) : ''
);

const resetAtDateHelper = (data): ResetAtHelperType => ({
  formatted: resetAtFormatted(data),
  seconds: resetAtSeconds(data),
});

export const MAX_DISTANCE = 160;
export const MAX_AGE = 55;
export const MIN_AGE = 18;

export class CurrentUser implements UserInterface {
  name: string;
  isCurrentUser: true = true;
  gender: 0 | 1;

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
  @observable goldAccount: boolean;
  @observable pos: Object = {};

  @action set(json: Object) {
    const { rating, user, purchases } = json;

    if (user) {
      extend(this, user);
    }

    if (purchases) {
      let plusAcc = false;
      let goldAcc = false;

      each(purchases, (p) => {
        plusAcc = p.product_type === 'plus';
        goldAcc = p.product_type === 'gold';
      });

      this.plusAccount = plusAcc;
      this.goldAccount = goldAcc;
    }

    if (rating) {
      this.like_limit_reset = rating.rate_limited_until;
      this.superlike_limit_reset = rating.super_likes.resets_at;
      this.superlike_remaining = rating.super_likes.remaining;
    }
  }

  @action fetch() {
    this.is_fetching = true;

    meta().then((data) => {
      this.set(data);

      this.is_fetching = false;
      this.is_authenticated = true;
    }).catch(() => {
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
        distance_filter: distance,
      });

      extend(this, data);
    } catch (e) { console.error(e); }

    this.isProcessing = false;
  }

  @action async updateLocation(lat: number, lon: number, errCallback: () => void) {
    this.isProcessing = true;

    try {
      const { data } = await API.post('/user/ping', {
        lat, lon,
      });

      if (data.error) {
        if (window.hj) {
          window.hj('tagRecording', ['ALocationErr']);
        }
        errCallback();
      } else {
        this.pos = {
          lat, lon,
        };
      }
    } catch (e) {
      console.error(e);
    }
    this.isProcessing = false;
  }

  @computed get avatarUrl(): string {
    return get(this.photos, [0, 'url']);
  }

  @computed get likeResetDate(): ?string {
    if (this.like_limit_reset) {
      return moment(this.like_limit_reset).format();
    }
    return null;
  }

  @computed get superlikeResetDate(): ?string {
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
