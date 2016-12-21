import Dexie from 'dexie'
import relationships from 'dexie-relationships'
import { core, like, pass, superLike, updates } from './runtime'

const db = new Dexie('tinder', { addons: [relationships] })

db.version(1).stores({
  users: '_id,name,done',
  actions: '++,type,date,_id -> users._id',
  matches: '_id,isSuperLike,isBoostMatch,date,lastActivityDate,isNew,userId -> users._id',
  messages: '_id, match_id, isNew, from -> users._id, to -> users._id',
})

db.open().catch(function (e) {
  console.log('Open failed: ', e)
})

const Data = {
  registerMessagesHook(callback) {
    db.messages.hook('creating', (mods, primKey, obj, trans) => {
      callback(primKey)
    })
  },

  registerMatchesHook(callback, type = 'creating') {
    db.matches.hook(type, function(mods, primKey, obj, trans) {
      this.onsuccess = callback(primKey)
    })
  },

  clearRecs() {
    return db.users.where('done').equals(0).delete()
  },

  actions() {
    return db.actions.with({ user: '_id' })
  },

  matches() {
    return db.matches
  },

  messages(conversationId) {
    return db.messages.where('match_id').equals(conversationId)
  },

  updates() {
    return new Promise((resolve, reject) => {
      updates().then(({ matches }) => {
        db.transaction('rw', db.users, db.matches, db.messages, function() {
          _.each(matches, match => {
            if (!match.is_new_message) {
              db.users.where('_id').equals(match.person._id).first(p => {
                if (p) return

                db.users.add(match.person)
              })

              db.matches.where('_id').equals(match._id).first(m => {
                if (m) return

                db.matches.add({
                  _id: match._id,
                  userId: match.person._id,
                  date: new Date(match.created_date),
                  lastActivityDate: new Date(match.last_activity_date),
                  person: match.person,
                  isNew: 1,
                  isBoostMatch: match.is_boost_match ? 1 : 0,
                  isSuperLike: match.is_super_like ? 1 : 0,
                })
              })
            }

            const messages = _.map(match.messages, m => ({ ...m, isNew: 0 }))

            db.messages.bulkPut(messages)
          })
        }).then(() => resolve())
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
        db.actions.add({ _id: id, type: 'like', date: new Date() })

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
        db.actions.add({ _id: id, type: 'pass', date: new Date() })

        resolve(resp)
      }).catch(e => reject(e))
    })
  },

  superLike(id) {
    return new Promise((resolve, reject) => {
      superLike(id).then(resp => {
        localStorage.setItem('superLikeExpiration', resp.super_likes.resets_at)

        if (!resp.limit_exceeded) {
          db.users.update(id, { done: 1 })
          db.actions.add({ _id: id, type: 'superlike', date: new Date() })

          resolve(resp)
        } else {
          reject('limit_exceeded')
        }
      })
    })
  },

  getActions() {
    return db.actions
  },

  _devAddNew(data) {
    db.matches.add(data)
  }
}
console.log(Data);

document.addEventListener('contentScript', e => {
  const data = e.detail
  console.log('data', data)
})

global.Data = {
  trigger(msg) {
    alert(1)
  }
}

export default Data
