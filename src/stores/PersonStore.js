import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';

import { get } from 'utils/api';

class PersonStore {
  @observable persons = [];

}

export default PersonStore;
