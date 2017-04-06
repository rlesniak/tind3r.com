// @flow

import ForerunnerDB from 'forerunnerdb';

import { get } from './api';

const fdb = new ForerunnerDB();
let db;

const personCollectionFunc = () => {
  return new Promise((resolve, reject) => {
    db.collection('person').load((err) => {
      const personCollection = db.collection('person');

      if (!err) resolve(personCollection);
      else reject();
    });
  })
}

const matchCollectionFunc = () => {
  return new Promise((resolve, reject) => {
    db.collection('match').load((err) => {
      const matchCollection = db.collection('match');

      if (!err) resolve(matchCollection);
      else reject();
    });
  })
}

async function create() {
  if (!db) {
    db = fdb.db('tind3r');
  }

  window.db = db;

  return db
}

export async function matchCollection() {
  create();

  const collection = await matchCollectionFunc();
  const persons = await personCollection();

  const matches = collection.find({}, {
    $join: [{
      person: {
        _id: 'personId',
        $as: 'person',
        $require: false,
        $multi: false,
      }
    }]
  });

  return matches;
}

export async function personCollection() {
  create();

  const persons = await personCollectionFunc()
  return persons
}

export async function fetchFromRemote() {
  const { data } = await get('/updates');

  return data;
}

export default create;
