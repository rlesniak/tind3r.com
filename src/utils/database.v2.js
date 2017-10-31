// @flow

import ForerunnerDB from 'forerunnerdb';

import { parseMatch, parsePerson } from 'utils/parsers';

import type { MessageType } from 'types/message';
import type { MatchType } from 'types/match';
import type { PersonType } from 'types/person';
import type { ActionType } from 'types/action';

const fdb = new ForerunnerDB();
const db = fdb.db('tind3r');
db.debug(false);

export const collections = {
  matches: db.collection('matches'),
  persons: db.collection('persons'),
  messages: db.collection('messages'),
  actions: db.collection('actions'),
};

export function load() {
  let loaded = 0;

  window.db = db;

  return new Promise((resolve, reject) => {
    const checkIfLoaded = () => (loaded === 4 ? resolve() : null);
    const loadedCallback = (err) => {
      if (err) {
        reject(err);
      }

      loaded += 1;
      checkIfLoaded();
    };

    collections.matches.load(loadedCallback);
    collections.persons.load(loadedCallback);
    collections.messages.load(loadedCallback);
    collections.actions.load(loadedCallback);
  });
}

export function matchCollection(): Array<MatchType> {
  const matches: Array<MatchType> = collections.matches.find({}, {
    $join: [{
      persons: {
        _id: 'person_id',
        $as: 'person',
        $require: true,
        $multi: false,
      },
    }],
  });

  matches.forEach((match) => {
    const lastMessage: MessageType = collections.messages.find({
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
  const messages = collections.messages.find({
    match_id: matchId,
  });

  return messages;
}

export function getMatch(matchId: string): MatchType {
  return collections.matches.find({
    _id: matchId,
  })[0];
}

export function getMatchByPerson(personId: string): MatchType {
  return collections.matches.find({
    person_id: personId,
  })[0];
}

export function getPerson(personId: string): PersonType {
  return collections.persons.find({
    _id: personId,
  })[0];
}

export function createAction(payload: ActionType) {
  collections.actions.insert(payload);
  collections.actions.save();
}

export function getActions(personId?: string): Array<ActionType> {
  let query = {};

  if (personId) {
    query = { person_id: personId };
  }

  return collections.actions.find(query);
}

export function removeActions() {
  collections.actions.remove();
  collections.actions.save();
}

export function removeAction(personId: string) {
  collections.actions.remove({ person_id: personId });
  collections.actions.save();
}

export function createPersons(persons: Array<PersonType>) {
  const collection = collections.persons;
  collection.insert(persons);
  collection.save();
}

export function createMatches(data: Array<MatchType>) {
  const collection = collections.matches;
  collection.insert(data);
  collection.save();
}

export function createMatch(match: Object) {
  const parsedMatch: MatchType = parseMatch(match, true);
  const parsedPerson: PersonType = parsePerson(match.person);

  createMatches([parsedMatch]);
  createPersons([parsedPerson]);
}

export function updateMatch(matchIds: string[], payload: Object) {
  collections.matches.update({ _id: { $in: matchIds } }, payload);
  collections.matches.save();
}

export function updatePerson(personId: string, payload: Object) {
  collections.persons.updateById(personId, parsePerson(payload));
  collections.persons.save();
}

export function removeMessage(_id: string) {
  collections.messages.remove({ _id });
  collections.messages.save();
}

export function removeMatch(_id: string | string[]) {
  const removedMatches = collections.matches.remove({ _id });
  let personsIds;

  if (Array.isArray(_id)) {
    personsIds = removedMatches.map(match => match.person_id);
  } else {
    personsIds = removedMatches.person_id;
  }

  collections.messages.remove({ match_id: _id });
  collections.persons.remove({ _id: personsIds });

  collections.matches.save();
  collections.messages.save();
  collections.persons.save();
}

export function purge() {
  collections.matches.remove();
  collections.messages.remove();
  collections.persons.remove();

  collections.matches.save();
  collections.messages.save();
  collections.persons.save();

  removeActions();
}
