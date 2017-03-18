// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';

import API from 'Utils/api';

async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject();
  }
}

class CurrentUser {
  @observable is_fetched: boolean = false;
  @observable is_error: boolean = false;
  @observable like_limit_reset: ?string = null;
  @observable superlike_limit_reset: ?string = null;
  @observable _id: string;
  @observable full_name: string;
  @observable photos: Object;

  @action set(json: Object) {
    if (json) {
      extend(this, json);
    }
  }

  @action fetch() {
    meta().then(data => {
      // ReactGA.set({ userId: data.user._id })

      this.is_fetched = true;
    }).catch(e => {
      console.log(e);
      this.is_fetched = false;
      this.is_error = true;
    })
  }
}

export default new CurrentUser();
