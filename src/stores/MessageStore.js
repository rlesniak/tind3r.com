import { observable, transaction, computed, action } from 'mobx'
import _ from 'lodash'
import Message from '../models/Message'
import Data from '../data'

class MessageStore {
  @observable messages = []
  @observable isLoading = true

  constructor(store, json) {
    this.store = store
    this.authorId = json.userId
    this.convId = json._id

    this.fetch()
  }

  @action fetch() {
    Data.registerMessagesHook(this.newMessageHook.bind(this))

    Data.messages(this.convId).toArray().then(action(allMsgs => {
      _.each(allMsgs, msg => this.updateMessage(msg))
      this.isLoading = false
    }))
  }

  newMessageHook(msg) {
    console.log('MSG HOOK');
    if (msg.match_id === this.convId) {
      this.updateMessage(msg)
    }
  }

  @action updateMessage(json) {
    const message = new Message(this, json, this.authorId)
    this.messages.push(message)
  }

  @computed get last() {
    return _.last(this.messages) || {}
  }
}

export default MessageStore
