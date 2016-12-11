import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import { user } from '../runtime'

class User {
  id = null
  store = null
  @observable isLoading = false

  constructor(store, id) {
    this.store = store
    this.id = id
  }

  @action fetch() {
    this.isLoading = true
    user(this.id).then(action(resp => {
      if (resp.message) {
        this.message = resp.message
        return
      }

      this.isLoading = false
      extendObservable(this, resp.results)
    })).catch(resp => {
      this.needFb = true
      this.isLoading = false
    })
  }

  @action setFromJson(json) {
    extendObservable(this, json)
  }

  @computed get age() {
    return moment().diff(this.birth_date, 'years')
  }

  @computed get seen() {
    return moment(this.ping_time).format('DD/MM HH:mm')
  }

  @computed get seenMin() {
    return moment(this.ping_time).fromNow()
  }

  @computed get km() {
    return (this.distance_mi * 1.6093).toFixed(0)
  }
}

export default User
