// @flow

import ForerunnerDB from 'forerunnerdb';

import { parseMatch, parsePerson } from 'utils/parsers';

import type { MessageType } from 'types/message';
import type { MatchType } from 'types/match';
import type { PersonType } from 'types/person';
import type { ActionType } from 'types/action';

const fdb = new ForerunnerDB();
let db;

export function load() {
  let loaded = 0;
  db = fdb.db('tind3r');

  window.db = db;

  return new Promise(resolve => {
    const checkIfLoaded = () => (loaded === 4 ? resolve() : null);
    const loadedCallback = () => {
      loaded += 1;
      checkIfLoaded();
    };

    db.collection('matches').load(loadedCallback);
    db.collection('persons').load(loadedCallback);
    db.collection('messages').load(loadedCallback);
    db.collection('actions').load(loadedCallback);
  });
}

function create() {
  if (!db) {
    db = fdb.db('tind3r');
  }

  window.db = db;

  return db;
}

export function matchCollection(): Array<MatchType> {
  const matches: Array<MatchType> = db.collection('matches').find({}, {
    $join: [{
      persons: {
        _id: 'person_id',
        $as: 'person',
        $require: false,
        $multi: false,
      },
    }],
  });

  matches.forEach(match => {
    const lastMessage: MessageType = db.collection('messages').find({
      match_id: match._id,
    }, {
      $limit: 1,
      $orderBy: {
        date: -1,
      },
    })[0];

    match.last_msg_from_db = lastMessage || {}; // eslint-disable-line
  });

  return matches;
}

export function getMessages(matchId: string): Array<MessageType> {
  const messages = db.collection('messages').find({
    match_id: matchId,
  });

  return messages;
}

export function getMatch(matchId: string): MatchType {
  return db.collection('matches').find({
    _id: matchId,
  })[0];
}

export function getMatchByPerson(personId: string): MatchType {
  return db.collection('matches').find({
    person_id: personId,
  })[0];
}

export function getPerson(personId: string): PersonType {
  return db.collection('persons').find({
    _id: personId,
  })[0];
}

export function createAction(payload: ActionType) {
  db.collection('actions').insert(payload);
  db.collection('actions').save();
}

export function getActions(personId?: string): Array<ActionType> {
  let query = {};

  if (personId) {
    query = { person_id: personId };
  }

  return db.collection('actions').find(query);
}

export function removeAction(personId: string) {
  db.collection('actions').remove({ person_id: personId });
}

export function createPersons(persons: Array<PersonType>) {
  const collection = db.collection('persons');
  collection.insert(persons);
  collection.save();
}

export function createMatches(data: Array<MatchType>) {
  const collection = db.collection('matches');
  collection.insert(data);
  collection.save();
}

export function createMatch(match: Object) {
  const parsedMatch: MatchType = parseMatch(match, true);
  const parsedPerson: PersonType = parsePerson(match.person);

  createMatches([parsedMatch]);
  createPersons([parsedPerson]);
}

export function updateMatch(matchId: string, payload: Object) {
  console.log('update', matchId, payload);
  db.collection('matches').updateById(matchId, payload);
  db.collection('matches').save();
}

export function updatePerson(personId: string, payload: Object) {
  db.collection('persons').updateById(personId, parsePerson(payload));
  db.collection('persons').save();
}

export function removeMessage(_id: string) {
  db.collection('messages').remove({ _id });
  db.collection('messages').save();
}

export function removeMatch(_id: string) {
  const removedMatch = db.collection('matches').remove({ _id });
  db.collection('messages').remove({ match_id: _id });
  db.collection('persons').remove({ _id: removedMatch.person_id });

  db.collection('matches').save();
  db.collection('messages').save();
  db.collection('persons').save();
}

export default create;
