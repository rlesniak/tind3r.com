import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import _ from 'lodash'
import { user, meta } from '../runtime'
import Data from '../data'

class Message {
  id = null
  store = null
  @observable isSending = false
  @observable done = 0

  constructor(store, json = {}, authorId, participant) {
    this.store = store
    this.id = json._id
    this.authorId = authorId
    this.setFromJson(json)
    this.participant = participant
  }

  @action create(body) {
    this.isSending = true

    setTimeout(() => {
      this.isSending = false
    }, 2000)

    this.setFromJson({
      message: body,
      id: _.uniqueId(),
    })
  }

  @action setFromJson(json) {
    extendObservable(this, json)
  }

  @computed get isAuthor() {
    return this.authorId === this.from
  }

  @computed get date() {
    if (this.created_date) {
      return moment(this.created_date).format('DD/MM HH:mm')
    }
  }
}

export default Message
