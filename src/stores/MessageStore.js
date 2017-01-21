import { observable, computed, action } from 'mobx'
import _ from 'lodash'
import Message from '../models/Message'
import Data from '../data'

class MessageStore {
  @observable messages = []
  @observable isLoading = true

  constructor(match, json, fetchDoneCallback) {
    this.match = match
    this.authorId = json.userId
    this.matchId = json._id
    this.participant = json.participants[0]

    this.fetch(fetchDoneCallback)
  }

  @action fetch(fetchDoneCallback) {
    Data.registerMessagesHook(this.newMessageHook.bind(this))

    Data.db().users.where('_id').equals(this.participant).first((user) => {
      Data.messages(this.matchId).then(action((allMsgs) => {
        _.each(allMsgs, msg => this.updateMessages(msg, user))
        this.isLoading = false

        fetchDoneCallback()
      }))
    })
  }

  @action create(body, payload) {
    const message = new Message(this, {}, this.authorId)
    message.create(this.matchId, body, payload)
    this.messages.push(message)
  }

  newMessageHook(msg) {
    if (msg.match_id === this.matchId && msg.from === this.authorId) {
      this.match.isNew = true
      this.updateMessages(msg)
    }
  }

  @action updateMessages(json, participant) {
    const message = new Message(this, json, this.authorId, participant)
    this.messages.push(message)
  }

  @computed get hasMessages() {
    return !!this.messages.length
  }

  @computed get last() {
    return _.last(_.filter(this.messages, { isSending: false })) || {}
  }
}

export default MessageStore
