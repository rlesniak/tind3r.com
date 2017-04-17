// @flow

import ForerunnerDB from 'forerunnerdb';
import { first } from 'lodash';

import { get } from './api';

const fdb = new ForerunnerDB();
let db;

let matches;

export function load() {
  let loaded = 0;
  db = fdb.db('tind3r');

  window.db = db;

  return new Promise((resolve, reject) => {
    const checkIfLoaded = () => loaded === 3 ? resolve() : null;
    const loadedCallback = name => {
      loaded++;
      checkIfLoaded();
    }

    db.collection('matches').load(loadedCallback);
    db.collection('persons').load(loadedCallback);
    db.collection('messages').load(loadedCallback);
  })
}

function create() {
  if (!db) {
    db = fdb.db('tind3r');
  }

  window.db = db;

  return db
}

export function matchCollection() {
  const matches: [] = db.collection('matches').find({}, {
    $join: [{
      persons: {
        _id: 'person_id',
        $as: 'person',
        $require: false,
        $multi: false,
      }
    }]
  });

  matches.forEach(match => {
    const lastMessage = db.collection('messages').find({
      match_id: match._id,
    }, {
      $limit: 1,
      $orderBy: {
        date: -1,
      },
    })[0];

    match.lastMessage = lastMessage || {};
  });

  return matches;
}

export default create;
