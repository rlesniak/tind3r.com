// @flow

import * as RxDB from 'rxdb';
import {
  default as idb
} from 'pouchdb-adapter-idb';

import PersonScheme from 'schemes/person';
import ActionScheme from 'schemes/action';
import MatchScheme from 'schemes/match';

import type { ActionType } from '../types/action';
import type { MatchType } from '../types/match';

RxDB.plugin(idb);

const collections = [{
  name: 'persons',
  schema: PersonScheme,
  sync: true
}, {
  name: 'actions',
  schema: ActionScheme,
  sync: true
}, {
  name: 'matches',
  schema: MatchScheme,
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

const findPerson = async function(id: string) {
  const db = await get();
  const person = await db.persons.findOne({ id: { $eq: id }}).exec();

  return person;
}

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

export async function createOrUpdateMatch(json: MatchType): Promise<*> {
  const db = await get();

  return db.matches.upsert(json);
}

export async function getMatches(): Promise<*> {
  const db = await get();

  const matches = await db.matches.find().exec();

  const matchesWithPerson = await Promise.all(matches.map(async match => {
    const person = await findPerson(match.id);

    return { ...match, person };
  }));

  return matchesWithPerson;
}
