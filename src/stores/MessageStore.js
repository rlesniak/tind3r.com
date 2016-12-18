import { observable, transaction, computed, action } from 'mobx'
import _ from 'lodash'
import Message from '../models/Message'
import Data from '../data'

class MessageStore {
  @observable messages = []
  @observable isLoading = true;
  @observable isCharging = true;

  constructor(store, messages, authorId) {
    this.store = store
    this.authorId = authorId

    transaction(() => {
      _.each(messages, msg => this.updateMessage(msg))
    })
  }

  @action updateMessage(json) {
    if (_.find(this.messages, { id: json._id })) {
      return
    }

    const message = new Message(this, json._id, json, this.authorId)
    this.messages.push(message)
  }

  @computed get last() {
    return _.last(this.messages) || {}
  }
}

export default MessageStore
