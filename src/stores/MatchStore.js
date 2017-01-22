import { observable, computed, action } from 'mobx'
import _ from 'lodash'
import Data from '../data'
import Match from '../models/Match'

class MatchStore {
  @observable matches = []
  @observable isLoading = true;
  @observable isCharging = true;
  @observable activeFilter = null;

  matchesProcessed = 0

  constructor() {
    this.fetchFromRemote()
  }

  @action fetch() {
    Data.registerMatchesHook(this.newMatchHook.bind(this))

    Data.matches().then(data => {
      _.each(data, action(r => {
        this.updateMatches(r, true)
      }))
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
    _.each(this.matches, match => {
      match.isNew = false
    })

    Data.db().matches.where('isNew').equals(1).modify({ isNew: 0 })
  }

  @action updateMatches(resp, withCallback) {
    if (_.find(this.matches, { id: resp._id }) || !resp.userId) {
      return
    }

    this.matches.push(new Match(this, resp, resp.user, () => {
      if (!withCallback) return

      this.matchesProcessed += 1

      if (this.matchesProcessed === this.matches.length) {
        this.isLoading = false
      }
    }))
  }

  setAsRead(match) {
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
