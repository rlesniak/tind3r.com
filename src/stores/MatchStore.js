import { observable, transaction, computed, action } from 'mobx'
import _ from 'lodash'
import Data from '../data'
import Match from '../models/Match'

class MatchStore {
  @observable matches = []
  @observable isLoading = true;
  @observable isCharging = true;
  @observable activeFilter = null;

  constructor() {
    this.fetchFromRemote()
  }

  fetch() {
    Data.registerMatchesHook(this.newMatchHook.bind(this))

    Data.matches().then((data) => {
      transaction(() => {
        _.each(_.sortBy(data, 'lastActivityDate'), action((r) => {
          this.updateMatches(r)
        }))
        this.isLoading = false
      })
    }).catch(() => {
      this.needFb = true
      this.isLoading = false
    })
  }

  newMatchHook(msg) {
    this.updateMatches(msg)
  }

  fetchFromRemote() {
    Data.updates().then(() => {
      this.fetch()
    })
  }

  @action remove(id) {
    _.remove(this.matches, { id })

    Data.db().matches.where('_id').equals(id).delete()
    Data.db().messages.where('match_id').equals(id).delete()
  }

  @action markAsRead() {
    _.each(this.matches, (match) => {
      match.isNew = false
    })

    Data.db().matches.where('isNew').equals(1).modify({ isNew: 0 })
  }

  @action updateMatches(resp) {
    if (_.find(this.matches, { id: resp._id }) || !resp.userId) {
      return
    }

    Data.db().users.where('_id').equals(resp.userId).first(action((user) => {
      this.matches.push(new Match(this, resp, user))
    }))
  }

  setAsDone(match) {
    match.isNew = false
    Data.db().matches.update(match.id, { isNew: 0 })
  }

  findMatch(id) {
    return _.find(this.matches, { id })
  }

  @action setFilter(value) {
    this.activeFilter = value
  }

  @computed get unreadCount() {
    return _.filter(this.matches, match => match.isNew).length
  }

  @computed get byDate() {
    return _.orderBy(this.filtered, 'lastActvityTime').reverse()
  }

  @computed get filtered() {
    switch (this.activeFilter) {
      case 'withoutMsgs':
        return _.filter(this.matches, match => (
          match.messageStore.messages.length === 0
        ))
      case 'unanswered':
        return _.filter(this.matches, match => (
          match.messageStore.messages.length === 1
        ))
      default:
        return this.matches
    }
  }
}

export default MatchStore
