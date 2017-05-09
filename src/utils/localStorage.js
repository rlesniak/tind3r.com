import store from 'store';

const APP_NAME = 'app.v2';

const ls = {
  get data() {
    return store.get(APP_NAME) || {};
  },

  get(key) {
    return this.data[key];
  },

  set(newData) {
    store.set(APP_NAME, { ...this.data, ...newData });
  },

  clear() {
    store.clearAll();
  },
};

export default ls;
