// @flow

import * as RxDB from 'rxdb';
import {
  default as idb
} from 'pouchdb-adapter-idb';

import PersonScheme from 'schemes/person';
import ActionScheme from 'schemes/action';

import type { ActionType } from '../types/action';

RxDB.plugin(idb);

const collections = [{
  name: 'persons',
  schema: PersonScheme,
  sync: true
}, {
  name: 'actions',
  schema: ActionScheme,
  sync: true
}];

let dbPromise = null;

const create = async function() {
  const db = await RxDB.create({
    name: 'tind3r',
    adapter: 'idb',
    multiInstance: true
  });

  await Promise.all(collections.map(colData => db.collection(colData)));
  window.db = db;
  return db;
};

export function get(): Promise<*> {
  if (!dbPromise) {
    dbPromise = create();
  }

  return dbPromise;
};

export async function createAction(json: ActionType): Promise<*> {
  const db = await get();

  return db.actions.insert(json);
}
