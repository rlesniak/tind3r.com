import { observable, computed, reaction, action } from 'mobx';
import map from 'lodash/map';
import find from 'lodash/find';
import each from 'lodash/each';
import filter from 'lodash/filter';

import { get } from 'utils/api';
import Person from 'models/Person';

class RecsStore {
  loadMoreHandler = null;

  @observable persons = [];
  @observable is_fetching: boolean = false;
  @observable is_loading_more: boolean = false;
  @observable isError: boolean = false;

  constructor() {
    this.loadMoreHandler = reaction(
      () => this.allVisible.length,
      length => {
        if (length <= 3 && !this.is_fetching && !this.is_loading_more) {
          this.fetchCore(true);
        }
      },
    );
  }

  @action async fetchCore(asLoadMore: boolean = false) {
    if (asLoadMore) {
      this.is_loading_more = true;
    } else {
      this.is_fetching = true;
    }

    try {
      const { data } = await get('/recs/core');

      const results = map(data.results, r => r.user);

      if (results.length > 0) {
        each(results, json => this.setPerson(json));
      }
    } catch (e) {
      this.isError = true;
    }

    this.is_fetching = false;
    this.is_loading_more = false;
  }

  @action setPerson(json) {
    if (find(this.persons, { _id: json._id })) {
      return;
    }

    const person = new Person(this, json);
    this.persons.push(person);
  }

  @computed get allVisible(): Array {
    return filter(this.persons, p => p.is_done === 0);
  }

  @computed get areRecsExhaust(): boolean {
    return !this.is_fetching && this.allVisible.length === 0;
  }
}

export default new RecsStore();
