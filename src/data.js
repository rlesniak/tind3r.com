import Dexie from 'dexie'
import relationships from 'dexie-relationships'
import { core, like, pass, superLike, updates } from './runtime'

const db = new Dexie('tinder', { addons: [relationships] })

db.version(1).stores({
  users: '_id,name,done',
  actions: '++,type,date,_id -> users._id',
  matches: '++,isSuperLike,isBoostMatch,date,_id -> users._id',
})

db.open().catch(function (e) {
  console.log('Open failed: ', e)
})

const Data = {
  clearRecs() {
    return db.users.where('done').equals(0).delete()
  },

  actions() {
    return db.actions.with({ user: '_id' })
  },

  matches() {
    return db.matches.with({ user: '_id' })
  },

  updates() {
    return new Promise((resolve, reject) => {
      updates().then(({ matches }) => {
        _.each(matches, match => {
          db.matches.put({
            _id: match.person._id,
            date: match.created_date,
            messages: match.messages,
            person: match.person,
            isBoostMatch: match.is_boost_match ? 1 : 0,
            isSuperLike: match.is_super_like ? 1 : 0,
          })
        })
      })
    })
  },

  core() {
    return new Promise((resolve, reject) => {
      core().then(resp => {
        const data = _.map(resp.results, r => r.user)
        _.each(data, user => db.users.add({ ...user, done: 0 }))

        resolve({ results: data, message: resp.message })
      }).catch(resp => reject(resp))
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
      }).catch(e => reject(e))
    })
  },

  pass(id) {
    return new Promise((resolve, reject) => {
      pass(id).then(resp => {
        db.users.update(id, { done: 1 })
        db.actions.put({ _id: id, type: 'pass', date: new Date() })

        resolve(resp)
      }).catch(e => reject(e))
    })
  },

  superLike(id) {
    return new Promise((resolve, reject) => {
      superLike(id).then(resp => {
        if (!resp.limit_exceeded) {
          db.users.update(id, { done: 1 })
          db.actions.put({ _id: id, type: 'superlike', date: new Date() })

          resolve(resp)
        } else {
          localStorage.setItem('superLikeExpiration', resp.super_likes.resets_at)
          reject('limit_exceeded')
        }
      })
    })
  },

  getActions() {
    return db.actions
  }
}

export default Data