import Dexie from 'dexie'
import { core, like } from './dev_runtime'

const db = new Dexie('tinder')
db.version(1).stores({
  users: '_id,name,done',
  actions: '_id,type,date',
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
        db.actions.put({ _id: id, type: 'like', date: new Date() })
        resolve(resp)
      })
    })
  },

  getActions() {
    return db.actions
  }
}

export default Data
