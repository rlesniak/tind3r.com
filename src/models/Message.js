import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import { user, meta } from '../runtime'
import Data from '../data'

class Message {
  id = null
  store = null
  @observable isLoading = false
  @observable isFetching = true
  @observable done = 0

  constructor(store, id = 0, json = {}, authorId) {
    this.store = store
    this.id = id
    this.authorId = authorId
    this.setFromJson(json)
  }

  @action fetch() {
    this.isFetching = true
    user(this.id).then(action(resp => {
      if (resp.message) {
        this.message = resp.message
        return
      }

      this.isFetching = false
      extendObservable(this, resp.results)
    })).catch(resp => {
      this.needFb = true
      this.isFetching = false
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
