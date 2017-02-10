import { observable, action, computed } from 'mobx'
import moment from 'moment'
import MessageStore from '../stores/MessageStore'
import User from './User'
import API from '../api'
import Data from '../data'

class Match {
  id = null
  store = null

  isMessageStoreFetched = false

  @observable lastActivityDate
  @observable user
  @observable isNew
  @observable isSuperLike
  @observable isBoostMatch
  @observable isBlocked
  @observable messageStore

  constructor(store, json = {}, user = {}, allMessagesFetchedCallback) {
    this.store = store
    this.id = json._id
    this.authorId = json.userId

    this.assignUser(user)
    this.setFromJson(json, allMessagesFetchedCallback)
  }

  @action assignUser(json) {
    this.user = new User(this, json._id, json)
  }

  @action setFromJson(json, allMessagesFetchedCallback) {
    this.lastActivityDate = json.lastActivityDate
    this.isNew = json.isNew
    this.isSuperLike = json.isSuperLike
    this.isBoostMatch = json.isBoostMatch
    this.isBlocked = json.isBlocked
    this.messageStore = new MessageStore(this, json, allMessagesFetchedCallback)
  }

  @action remove() {
    this.store.remove(this.id)
  }

  @action unmatch() {
    this.isBlocked = true

    API.del(`/user/matches/${this.id}`).then(() => {
      Data.db().matches.update(this.id, { isBlocked: 1 })
    }).catch(() => {
      this.isBlocked = false
    })
  }

  @computed get ago() {
    return moment(this.lastActvityTime).fromNow()
  }

  @computed get lastActvityTime() {
    if (this.messageStore.last.created_date) {
      return new Date(this.messageStore.last.created_date)
    }

    return new Date(this.lastActivityDate)
  }

  @computed get isNewMatch() {
    return this.isNew && !this.messageStore.hasMessages
  }

  @computed get areUnread() {
    return this.isNew
  }
}

export default Match
