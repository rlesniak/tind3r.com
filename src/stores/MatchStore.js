import { observable, transaction, computed, action, asFlat } from 'mobx'
import _ from 'lodash'
import moment from 'moment'
import Message from '../models/Message'
import Data from '../data'
import Match from '../models/Match'

class MatchStore {
  @observable matches = []
  @observable isLoading = true;
  @observable isCharging = true;

  constructor() {
    this.fetchFromRemote()
  }

  fetch(isCharging = false) {
    Data.registerMatchesHook(this.newMatchHook.bind(this))

    Data.matches().then(data => {
      transaction(() => {
        _.each(_.sortBy(data, 'lastActivityDate'), r => {
          this.updateMatches(r)
        })
        this.isLoading = false
      })
    }).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  newMatchHook(msg) {
    this.updateMatches(msg)
  }

  fetchFromRemote() {
    Data.updates().then(data => {
      this.fetch()
    })
  }

  @action updateMatches(resp) {
    if (_.find(this.matches, { id: resp._id }) || !resp.userId) {
      return
    }

    Data.db().users.where('_id').equals(resp.userId).first(action(user => {
      this.matches.push(new Match(this, resp))
    }))
  }

  setAsDone(match) {
    match.isNew = false
    Data.db().matches.update(match.id, { isNew: 0 })
  }

  findMatch(id) {
    return _.find(this.matches, { id })
  }

  @computed get byDate() {
    return _.orderBy(this.matches, 'lastActvityTime').reverse()
  }
}

export default MatchStore
