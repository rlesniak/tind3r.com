import { observable, transaction } from 'mobx'
import { core } from '../dev_runtime'
import User from '../models/User'

class UserStore {
  @observable users = []
  @observable message = null
  @observable isLoading = true;
  @observable needFb = false;

  constructor() {
    this.fetch()
  }

  fetch() {
    core().then(resp => {
      if (resp.message) {
        this.message = resp.message
        return
      }

      transaction(() => {
        _.each(resp.results, res => {
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
}

export default UserStore
