import { observable, transaction, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';
import each from 'lodash/each';

import { get } from 'Utils/api';
import Database from 'Utils/database';
import Person from 'models/Person';

class RecsStore {
  @observable persons = [];

  async core() {
    try {
      const { data } = await get('/recs/core');

      const results = map(data.results, r => r.user)

      return { results, message: data.message };
    } catch(e) {
      return e;
    }
  }

  @action fetchCore() {
    this.core().then(action((resp) => {
      if (resp.results.length > 0) {
        each(resp.results, json => this.setPerson(json))
      }
    }));
  }

  setPerson(json) {
    if (find(this.persons, { _id: json._id })) {
      return
    }

    const person = new Person(this, json)
    this.persons.push(person)
  }
}

export default RecsStore;
