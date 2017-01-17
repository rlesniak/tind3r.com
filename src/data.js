import Dexie from 'dexie'
import relationships from 'dexie-relationships'
import ReactGA from 'react-ga'
import _ from 'lodash'
import { purge } from './runtime'
import matchObj from './objects/match'
import API from './api'
import ls from './local-storage'

const db = new Dexie('tinder', { addons: [relationships] })

db.version(1).stores({
  users: '_id,name,done',
  actions: '++,type,date,_id -> users._id',
  matches: '_id,isSuperLike,isBoostMatch,date,lastActivityDate,isNew,userId -> users._id',
  messages: '_id, match_id, isNew, from -> users._id, to -> users._id',
})

db.open().catch((e) => {
  console.log('Open failed: ', e)
})

const Data = {
  registerMessagesHook(callback) {
    db.messages.hook('creating', function (mods, primKey, obj, trans) {
      this.onsuccess = callback(primKey)
    })
  },

  registerMatchesHook(callback, type = 'creating') {
    db.matches.hook(type, function (mods, primKey, obj, trans) {
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
    return db.matches.with({ user: 'userId' })
  },

  messages(matchId) {
    return db.messages.where('match_id').equals(matchId).with({ user: 'from' })
  },

  removePerson(id) {
    db.users.where('_id').equals(id).delete()
  },

  updates(firstFetch = false) {
    return new Promise((resolve, reject) => {
      const lastActivityDate = ls.data.lastActivity

      API.post('/updates', { last_activity_date: lastActivityDate }).then(({
        data: { blocks, matches, last_activity_date },
      }) => {
        ls.set({ lastActivity: last_activity_date })

        db.transaction('rw', db.users, db.matches, db.messages, () => {
          _.each(matches, (match) => {
            if (!match.is_new_message) {
              db.users.where('_id').equals(match.person._id).first((p) => {
                if (p) return

                db.users.add({
                  ...match.person,
                  done: 1,
                })
              })

              db.matches.where('_id').equals(match._id).first((m) => {
                if (!m) {
                  db.matches.add({
                    ...matchObj(match),
                    isBlocked: 0,
                    isNew: firstFetch ? 0 : 1,
                  })
                } else {
                  // eg. new message
                  db.matches.update(match._id, { isNew: 1 })
                }
              })
            } else {
              db.matches.update(match._id, { isNew: 1 })
            }

            const messages = _.map(match.messages, m => ({ ...m, isNew: 0 }))

            db.messages.bulkPut(messages)
          })

          _.each(blocks, (matchId) => {
            db.matches.update(matchId, { isBlocked: 1 })
          })
        }).then(() => {
          if (firstFetch) {
            db.matches.count((c) => {
              ReactGA.event({
                category: 'Initial',
                action: 'Matches loaded',
                label: _.toString(c),
              })
            })
          }
          resolve()
        }).catch((error) => {
          ReactGA.event({
            category: 'Initial',
            action: 'Error',
            label: error,
          })
        })
      })
    })
  },

  core() {
    return new Promise((resolve, reject) => {
      API.get('/recs/core').then(({ data }) => {
        const results = _.map(data.results, r => r.user)
        _.each(results, user => db.users.add({ ...user, done: 0 }))

        resolve({ results, message: data.message })
      }).catch(resp => reject(resp))
    })
  },

  sendMessage(matchId, message, payload = {}) {
    return new Promise((resolve, reject) => {
      API.post(`/user/matches/${matchId}`, { message, ...payload }).then(({ data }) => {
        db.messages.put({
          ...data,
          isNew: 0,
        })

        resolve(data)
      }).catch(resp => reject(resp))
    })
  },

  like(id) {
    return new Promise((resolve, reject) => {
      API.get(`/like/${id}`).then(({ data }) => {
        if (data.likes_remaining === 0) {
          if (data.rate_limited_until) {
            ls.set({ likeExpiration: data.rate_limited_until })
          }
        } else {
          db.users.update(id, { done: 1 })
          db.actions.add({ _id: id, type: 'like', date: new Date() })

          if (data.match) {
            db.matches.put(matchObj({
              ...data.match,
              person: { _id: id },
            }))
          }
        }

        resolve(data)
      }).catch(e => reject(e))
    })
  },

  pass(id) {
    return new Promise((resolve, reject) => {
      API.get(`/pass/${id}`).then(({ data }) => {
        db.users.update(id, { done: 1 })
        db.actions.add({ _id: id, type: 'pass', date: new Date() })

        resolve(data)
      }).catch(e => reject(e))
    })
  },

  superLike(id) {
    return new Promise((resolve, reject) => {
      API.post(`/like/${id}/super`).then(({ data }) => {
        ls.set({ superlikeExpiration: data.super_likes.resets_at })

        if (!data.limit_exceeded) {
          db.users.update(id, { done: 1 })
          db.actions.add({ _id: id, type: 'superlike', date: new Date() })

          if (data.match) {
            db.matches.put(matchObj({
              ...data.match,
              person: { _id: id },
            }))
          }

          resolve(data)
        } else {
          reject('limit_exceeded')
        }
      })
    })
  },

  updateProfile(distanceMi, payload) {
    return API.post('profile', {
      discoverable: payload.discoverable,
      gender_filter: payload.gender_filter,
      age_filter_min: payload.age_filter_min,
      age_filter_max: payload.age_filter_max,
      distance_filter: distanceMi, // in MI
      squads_discoverable: payload.squads_discoverable,
    })
  },

  countUnread(currentUserId, callback) {
    let count = 0
    db.transaction('rw', db.matches, db.messages, () => {
      db.matches.where('isNew').equals(1).toArray().then((matches) => {
        _.each(matches, (m) => {
          db.messages.where('match_id').equals(m._id).toArray().then((messages) => {
            if ((messages.length && _.last(messages).from !== currentUserId) || messages.length === 0) {
              count += 1
            }
          })
        })
      })
    }).then(() => {
      callback(count)
    })
  },

  getActions() {
    return db.actions
  },

  db() {
    return db
  },

  purge() {
    db.delete()
    purge()
  },

  removeMessage(id) {
    db.messages.where('_id').equals(id).delete()
  },

  addMessage(matchId, data) {
    db.matches.update(matchId, { isNew: 1 })
    db.messages.add({
      _id: data.id,
      isNew: 0,
      sent_date: '2016-12-31T15:11:00.756Z',
      created_date: '2016-12-31T15:11:00.756Z',
      to: '580cf937f63079810a7537f5',
      match_id: matchId,
      ...data,
    })
  },

  _devAddNew(data) {
    db.matches.add(data)
  },
}

global.Data = Data

export default Data
