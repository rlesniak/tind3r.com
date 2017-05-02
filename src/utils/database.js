import Dexie from 'dexie';
import relationships from 'dexie-relationships';
import moment from 'moment';
import each from 'lodash/each';
import map from 'lodash/map';

const dexieDb = new Dexie('tinder', { addons: [relationships] });

dexieDb.version(1).stores({
  users: '_id,name,done',
  actions: '++,type,date,_id -> users._id',
  matches: '_id,isSuperLike,isBoostMatch,date,lastActivityDate,isNew,userId -> users._id',
  messages: '_id, match_id, isNew, from -> users._id, to -> users._id',
});

dexieDb.open().catch(e => {
  console.log('Open failed: ', e);
});

const Database = {
  get data() {
    return dexieDb;
  },

  createAction(personId: string, type: string) {
    dexieDb.users.update(personId, { done: 1 });
    dexieDb.actions.add({ _id: personId, type, date: moment() });
  },

  createMatch(personId, payload) {
    dexieDb.matches.put({
      ...payload,
      person: { _id: personId },
    });
  },

  addUsers(users) {
    each(users, user => dexieDb.users.add({ ...user, done: 0 }));
  },
};

export default Database;
