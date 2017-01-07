import { observable, transaction, computed, reaction, action } from 'mobx'
import _ from 'lodash'
import User from '../models/User'
import Data from '../data'

class UserStore {
  @observable users = []
  @observable noRecs = false
  @observable isLoading = true;
  @observable isCharging = true;
  @observable activeFilter = null;

  constructor() {
    this.chargeReaction = null
  }

  initChargeReaction() {
    if (this.chargeReaction) return

    this.chargeReaction = reaction(
      () => this.all.length,
      (length) => {
        if (length <= 3 && !this.isCharging && !this.isLoading) {
          this.core(true)
        }
      }
    )
  }

  core(isCharging = false) {
    if (isCharging) {
      this.isCharging = true
    } else {
      this.isLoading = true
    }

    Data.core().then(action(resp => {
      if (!resp.results.length) {
        this.noRecs = true
        this.isCharging = false
        this.isLoading = false
        return
      }

      transaction(() => {
        _.each(_.sortBy(resp.results, '_id'), res => this.updateUser(res))
        this.noRecs = false
        this.isLoading = false
        this.isCharging = false
      })

      this.initChargeReaction()
    })).catch(resp => {
      this.isLoading = false
      this.isCharging = false
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

  @action setFilter(option) {
    this.activeFilter = option

    if (this.activeFilter === 'insta') {
      _.remove(this.users, user => {
        if (!user.hasInsta) {
          Data.removePerson(user._id)
          return true
        }

        return false
      })
    }
  }

  @computed get first() {
    return this.all.length ? _.head(this.all) : []
  }

  @computed get tail() {
    return this.all.length ? _.tail(this.all) : []
  }

  @computed get all() {
    return _.filter(this.users, user => {
      let filterValue = true
      if (this.activeFilter === 'insta') {
        filterValue = user.hasInsta
      }

      return filterValue && user.done === 0
    })
  }
}

export default UserStore
