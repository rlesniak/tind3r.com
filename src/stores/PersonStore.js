import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';

import { get } from 'Utils/api';
import Database from 'Utils/database';

class PersonStore {
  @observable persons = [];

}

export default PersonStore;
