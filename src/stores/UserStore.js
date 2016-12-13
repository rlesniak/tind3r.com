import { observable, transaction, computed } from 'mobx'
import Dexie from 'dexie'
import _ from 'lodash'
import { core } from '../dev_runtime'
import User from '../models/User'

class UserStore {
  @observable users = []
  @observable message = null
  @observable isLoading = true;
  @observable needFb = false;

  constructor() {
    this.db = new Dexie('tinder')

    this.initLocalDB()
    this.fetch()
  }

  initLocalDB() {
    this.db.version(1).stores({
      users: '_id,name',
    })
    this.db.open().catch(function (e) {
      console.log('Open failed: ', e)
    });
  }

  fetch() {
    core().then(resp => {
      if (resp.message) {
        this.message = resp.message
        return
      }

      transaction(() => {
        _.each(resp.results, res => {
          this.db.users.put(res.user)
          this.updateUser(res.user)
        })
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
    return this.users[0]
  }

  @computed get tail() {
    return _.tail(this.users)
  }
}

export default UserStore
