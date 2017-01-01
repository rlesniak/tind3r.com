import { observable, extendObservable, action, computed } from 'mobx'
import moment from 'moment'
import ReactGA from 'react-ga'
import { user, meta } from '../runtime'
import Data from '../data'

class User {
  id = null
  store = null
  @observable isLoading = false
  @observable isFetching = true
  @observable done = 0

  constructor(store, id, json) {
    this.store = store
    this.id = id

    if (json) {
      extendObservable(this, json)
    }
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

  @action asyncAction(method) {
    this.isLoading = true
    return new Promise((resolve, reject) => {
      method(this.id).then(action(resp => {
        if (resp.likes_remaining === 0) {
          reject(resp)
        } else {
          this.done = 1
          resolve(resp)
        }

        this.isLoading = false
      })).catch(action(resp => {
        reject(resp)
        this.isLoading = false
      }))
    })
  }

  @action like() : Promise {
    return this.asyncAction(Data.like)
  }

  @action pass() : Promise {
    return this.asyncAction(Data.pass)
  }

  @action superLike() : Promise {
    return this.asyncAction(Data.superLike)
  }

  @action fetchMeta() {
    this.isLoading = true
    return new Promise((resolve, reject) => {
      meta().then(action(resp => {
        extendObservable(this, resp.user)
        this.isLoading = false

        ReactGA.set({ userId: resp.user._id })

        resolve()
      })).catch(status => {
        reject(status)
      })
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

  @computed get instaLink() {
    if (this.instagram && this.instagram.username) {
      return `https://www.instagram.com/${this.instagram.username}/`
    }

    return null
  }

  @computed get instaName() {
    return this.instagram && this.instagram.username
  }

  @computed get school() {
    if (this.schools.length && _.head(this.schools)) {
      return this.schools[0].name
    }

    return null
  }
}

export default User
