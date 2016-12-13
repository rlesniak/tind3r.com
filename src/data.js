import Dexie from 'dexie'
import { core, like, pass } from './runtime'

const db = new Dexie('tinder')

db.version(1).stores({
  users: '_id,name,done',
  actions: '_id,type,date',
  matches: '_id,isSuperLike,isBoostMatch,date',
})

db.open().catch(function (e) {
  console.log('Open failed: ', e)
})

const Data = {
  fetch() {
    return new Promise((resolve, reject) => {
      db.users.where('done').equals(0).toArray().then(users => {
        if (users.length > 3) {
          resolve({ results: users })
        } else {
          core().then(resp => {
            const data = _.map(resp.results, r => r.user)
            _.each(data, user => db.users.put({ ...user, done: 0 }))

            resolve({ results: data, message: resp.message })
          }).catch(resp => reject(resp))
        }
      })
    })
  },

  like(id) {
    return new Promise((resolve, reject) => {
      like(id).then(resp => {
        db.users.update(id, { done: 1 })
        db.actions.put({ _id: id, type: 'like', date: new Date() })

        if (resp.match) {
          db.matches.put({
            _id: id,
            isBoostMatch: resp.match.is_boost_match ? 1 : 0,
            isSuperLike: resp.match.is_super_like ? 1 : 0,
            date: new Date()
          })
        }
        resolve(resp)
      })
    })
  },

  pass(id) {
    return new Promise((resolve, reject) => {
      pass(id).then(resp => {
        db.users.update(id, { done: 1 })
        db.actions.put({ _id: id, type: 'pass', date: new Date() })

        resolve(resp)
      })
    })
  },

  getActions() {
    return db.actions
  }
}

export default Data
