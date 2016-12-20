import { observable, transaction, computed, reaction } from 'mobx'
import _ from 'lodash'
import Message from '../models/Message'
import Data from '../data'
import MessageStore from './MessageStore'

class ConversationStore {
  @observable conversations = []
  @observable messages = []
  @observable isLoading = true;
  @observable isCharging = true;

  constructor() {
  }

  fetch(isCharging = false) {
    Data.matches().then(data => {
      _.each(data, r => {
        this.updateConversation(r)
      })
    }).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  fetchFromRemote() {
    Data.updates().then(data => {
      this.fetch()
    })
  }

  updateConversation(resp) {
    if (_.find(this.conversations, { id: resp._id })) {
      return
    }

    this.conversations.push({
      id: resp._id,
      date: resp.date,
      person: resp.person,
      messageStore: new MessageStore(this, resp.messages, resp.person._id),
    })
  }

  findConversation(id) {
    return _.find(this.conversations, { id })
  }
}

export default ConversationStore
