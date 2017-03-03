import { observable, transaction, computed, reaction, action } from 'mobx'
import _ from 'lodash'
import User from '../models/User'
import Data from '../data'
import ls from 'local-storage'

class UserStore {
  @observable users = []
  @observable noRecs = false
  @observable isLoading = true;
  @observable isCharging = true;
  @observable activeFilter = null;
  @observable superLikeRemaining = 0;

  constructor() {
    this.chargeReaction = null
    this.superLikeRemaining = ls.data.superLikeRemaining
  }

  initChargeReaction() {
    if (this.chargeReaction) return

    this.chargeReaction = reaction(
      () => this.all.length,
      length => {
        if (length <= 3 && !this.isCharging && !this.isLoading) {
          this.core(true)
        }
      },
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
    })).catch(() => {
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

  @action setSuperlikesRemaining(value) {
    this.superLikeRemaining = value
    ls.set({ superLikeRemaining: value })
  }

  @action setFilter(option) {
    this.activeFilter = option

    if (this.activeFilter === 'insta') {
      _.each(this.users, user => {
        if (
          (this.activeFilter === 'insta' && !user.hasInsta) ||
          (this.activeFilter === 'bio' && !user.hasBio)
        ) {
          Data.removePerson(user._id)
        }
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

      if (this.activeFilter === 'bio') {
        filterValue = user.hasBio
      }

      return filterValue && user.done === 0
    })
  }
}

export default UserStore
