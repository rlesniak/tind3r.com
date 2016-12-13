import { observable, transaction, computed } from 'mobx'
import _ from 'lodash'
import User from '../models/User'
import Data from '../data'

class UserStore {
  @observable users = []
  @observable message = null
  @observable isLoading = true;
  @observable needFb = false;

  constructor() {
    this.fetch()
  }

  fetch() {
    Data.fetch().then(resp => {
      if (!resp.results) {
        this.message = resp.message
        return
      }

      transaction(() => {
        _.each(resp.results, res => this.updateUser(res))
        this.isLoading = false
      })
    }).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  updateUser(json) {
    const user = new User(this, json._id)
    user.setFromJson(json)
    this.users.push(user)
  }

  @computed get first() {
    return _.head(this.users)
  }

  @computed get tail() {
    return _.tail(this.users)
  }
}

export default UserStore
