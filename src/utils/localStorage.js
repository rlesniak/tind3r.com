import store from 'store';
import get from 'lodash/get';

const APP_NAME = 'app.v2';

const ls = {
  get data() {
    return store.get(APP_NAME) || {};
  },

  get(key, defaultValue = null) {
    return get(this.data, key, defaultValue);
  },

  set(newData) {
    store.set(APP_NAME, { ...this.data, ...newData });
  },

  clear() {
    store.clearAll();
  },
};

export default ls;
