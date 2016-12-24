import { observable, transaction, computed, reaction, asFlat } from 'mobx'
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
    this.fetchFromRemote()
  }

  fetch(isCharging = false) {
    Data.registerMatchesHook(this.newConversationHook.bind(this))

    Data.matches().then(data => {
      transaction(() => {
        _.each(_.sortBy(data, 'lastActivityDate'), r => {
          this.updateConversation(r)
        })
        this.isLoading = false
      })
    }).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  newConversationHook(msg) {
    this.updateConversation(msg)
  }

  fetchFromRemote() {
    Data.updates().then(data => {
      this.fetch()
      localStorage.setItem('firstFetch', true)
    })
  }

  updateConversation(resp) {
    if (_.find(this.conversations, { id: resp._id }) || !resp.userId) {
      return
    }

    this.conversations.push({
      id: resp._id,
      date: resp.date,
      user: resp.user,
      isNew: resp.isNew,
      messageStore: new MessageStore(this, resp.userId, resp._id),
    })
  }

  setAsDone(conversation) {
    conversation.isNew = false
    Data.db().matches.update(conversation.id, { isNew: 0 })
  }

  findConversation(id) {
    return _.find(this.conversations, { id })
  }
}

export default ConversationStore
