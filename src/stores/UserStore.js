import { observable, transaction, computed, reaction } from 'mobx'
import _ from 'lodash'
import User from '../models/User'
import Data from '../data'

class UserStore {
  @observable users = []
  @observable message = null
  @observable isLoading = true;
  @observable isCharging = true;
  @observable needFb = false;

  constructor() {
    this.core() // Load only if user refresh/first visit page
  }

  initChargeReaction() {
    reaction(
      () => this.all.length,
      (length) => {
        if (length <= 3) {
          this.core(true)
        }
      }
    )
  }

  core(isCharging = false) {
    if (isCharging) {
      this.isCharging = true
    }

    Data.core().then(resp => {
      if (!resp.results.length) {
        this.message = resp.message
        return
      }

      transaction(() => {
        _.each(_.sortBy(resp.results, '_id'), res => this.updateUser(res))
        this.isLoading = false
        this.isCharging = false
      })

      this.initChargeReaction()
    }).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  updateUser(json) {
    if (_.find(this.users, { id: json._id })) {
      return
    }

    const user = new User(this, json._id)
    user.setFromJson(json)
    this.users.push(user)
  }

  find(id) {
    return _.find(this.users, { id }) || new User(this, id)
  }

  @computed get first() {
    return _.head(this.all)
  }

  @computed get tail() {
    return _.tail(this.all)
  }

  @computed get all() {
    return _.filter(this.users, { done: 0 })
  }
}

export default UserStore
