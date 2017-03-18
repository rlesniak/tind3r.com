import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';
import each from 'lodash/each';
import filter from 'lodash/filter';

import { get } from 'Utils/api';
import Database from 'Utils/database';
import Person from 'models/Person';

async function core() {
  try {
    const { data } = await get('/recs/core');
    
    const results = map(data.results, r => r.user)

    return { results, message: data.message };
  } catch(e) {
    return e;
  }
}

class RecsStore {
  @observable persons = [];
  @observable is_fetching: boolean = false;

  @action fetchCore() {
    this.is_fetching = true;

    core().then(action(resp => {
      if (resp.results.length > 0) {
        each(resp.results, json => this.setPerson(json))
      }

      this.is_fetching = false;    
    }));
  }

  @action setPerson(json) {
    if (find(this.persons, { _id: json._id })) {
      return
    }

    const person = new Person(this, json)
    this.persons.push(person)
  }

  @computed get allVisible(): Array {
    return filter(this.persons, p => p.is_done === 0);
  }
}

export default new RecsStore();
