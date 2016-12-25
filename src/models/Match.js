import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import { user, meta } from '../runtime'
import Data from '../data'
import MessageStore from '../stores/MessageStore'

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
    this.user = json.user
    this.isNew = json.isNew
    this.messageStore = new MessageStore(this, json)
  }

  @computed get ago() {
    return moment(this.lastActivityDate).fromNow()
  }
}

export default Match
