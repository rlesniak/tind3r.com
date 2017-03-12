import Dexie from 'dexie';
import relationships from 'dexie-relationships';

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

  addUsers(users) {
    each(users, user => dexieDb.users.add({ ...user, done: 0 }))
  },
};

export default Database;
