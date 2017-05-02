import store from 'store';

const ls = {
  get data() {
    return store.get('app') || {};
  },

  get(key) {
    return this.data[key];
  },

  set(newData) {
    store.set('app', { ...this.data, ...newData });
  },

  clear() {
    store.clear();
  },
};

export default ls;
