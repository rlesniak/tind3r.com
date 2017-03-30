// @flow

import { observable, extendObservable, action, computed } from 'mobx';
import moment from 'moment';
import extend from 'lodash/extend';
import get from 'lodash/get';

import API from 'Utils/api';

class Match {
  id: string;
  store: Object;

  @observable is_fetched: boolean = false;

  @action fetch() {
  }
}

export default new Match();
