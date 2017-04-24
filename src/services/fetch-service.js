// @flow

import { each, first, pick } from 'lodash';

import API from 'Utils/api';
import LS from 'Utils/localStorage';
import DB from 'Utils/database.v2';

import type { MatchType } from '../types/match';
import type { PersonType } from '../types/person';
import type { MessageType } from '../types/message';

const getMatch = (match, isNew): MatchType => ({
  _id: match.id,
  person_id: first(match.participants),
  date: match.created_date,
  last_activity_date: match.last_activity_date,
  is_new: isNew,
  is_boost_match: match.is_boost_match,
  is_super_like: match.is_super_like,
});

const getPerson = (person): PersonType => pick(person, [
  '_id', 'birth_date', 'ping_time', 'schools',
  'distance_mi', 'connection_count', 'common_friends',
  'bio', 'name', 'photos', 'gender', 'distance_mi', 'age'
]);

const getMessage = (message): MessageType => ({
  _id: message._id,
  id: message._id,
  to_id: message.to,
  from_id: message.from,
  match_id: message.match_id,
  body: message.message,
  date: message.sent_date,
});

const processMessages = (match) => {
  const messages = [];
  each(match.messages, message => messages.push(getMessage(message)));

  const collection = DB().collection('messages');
  collection.insert(messages);
  collection.save();

  if (match.is_new_message) {
    DB().collection('matches').updateById(match.id, { is_new: 1 });
  }
}

const savePersonsToDb = persons => {
  const collection = DB().collection('persons');
  collection.insert(persons);
  collection.save();
}

const saveMatchesToDb = data =>{
  const collection = DB().collection('matches');
  collection.insert(data);
  collection.save();
}

export default {
  updates() {
    const lastActivityDate = LS.data.lastActivity

    return new Promise((resolve, reject) => {
      API.post('/updates', { last_activity_date: lastActivityDate }).then(({ data }) => {
        const { matches, last_activity_date } = data;

        const parsedMatches: MatchType[] = [];
        const parsedPersons: PersonType[] = [];
        const parsedMessages: MessageType[] = [];

        // LS.set({ lastActivity: last_activity_date });

        each(matches, match => {
          parsedMatches.push(getMatch(match, !LS.data.lastActivity));
          parsedPersons.push(getPerson(match.person));

          processMessages(match);
        });

        saveMatchesToDb(parsedMatches);
        savePersonsToDb(parsedPersons);

        resolve({
          matches: parsedMatches,
          persons: parsedPersons,
          messages: parsedMessages,
        });
      });
    });
  },

  sendMessage(matchId: string, message: string, payload: ?Object) {
    return new Promise((resolve, reject) => {
      API.post(`/user/matches/${matchId}`, { message, ...payload }).then(({ data }) => {
        const collection = DB().collection('messages');
        const message = getMessage(data);

        collection.insert(message);
        collection.save();

        resolve(message)
      }).catch(resp => reject(resp))
    })
  }
}

export async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject();
  }
}



