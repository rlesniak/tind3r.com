import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import { user, meta } from '../runtime'
import Data from '../data'
import MessageStore from '../stores/MessageStore'
import User from './User'

class Match {
  id = null
  store = null

  @observable lastActivityDate
  @observable user
  @observable isNew
  @observable messageStore

  constructor(store, json = {}) {
    this.store = store
    this.id = json._id
    this.authorId = json.userId
    this.setFromJson(json)
  }

  @action setFromJson(json) {
    this.lastActivityDate = json.lastActivityDate
    this.isNew = json.isNew
    this.user = new User(this, json.user._id, json.user)
    this.messageStore = new MessageStore(this, json)
  }

  @computed get ago() {
    return moment(this.lastActivityDate).fromNow()
  }
}

export default Match
