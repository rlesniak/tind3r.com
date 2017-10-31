// @flow

import store from 'store';
import get from 'lodash/get';
import pullAt from 'lodash/pullAt';

const APP_NAME = 'app.v2';

const ls = {
  get data(): Object {
    return store.get(APP_NAME) || {};
  },

  get(key: string | string[], defaultValue: any = null): Object {
    return get(this.data, key, defaultValue);
  },

  set(newData: Object) {
    store.set(APP_NAME, { ...this.data, ...newData });
  },

  get settings() {
    return this.get('settings', {});
  },

  setSettings(data: Object = {}) {
    this.set({
      settings: {
        ...this.settings,
        ...data,
      },
    });
  },

  get templates() {
    return this.get('templates', []);
  },

  createTemplate(value: ?string) {
    if (!value) return;

    const templates: string[] = this.templates;
    templates.push(value);

    this.set({ templates });
  },

  removeTemplateAt(index: number) {
    const templates = this.templates;
    pullAt(templates, index);

    this.set({ templates });
  },

  clear() {
    store.clearAll();
  },
};

window.ls = ls;

export default ls;
