// @flow

import { each } from 'lodash';

import API from 'utils/api';
import LS from 'utils/localStorage';
import DB, { updateMatch } from 'utils/database.v2';
import { parseMatch, parsePerson, parseMessage } from 'utils/parsers';

import type { MatchType } from 'types/match';
import type { PersonType } from 'types/person';
import type { MessageType } from 'types/message';

const processMessages = match => {
  const messages = [];
  each(match.messages, message => messages.push(parseMessage(message)));

  const collection = DB().collection('messages');
  collection.insert(messages);
  collection.save();

  if (match.is_new_message) {
    updateMatch(match._id, { is_new: true });
  }
};

const savePersonsToDb = (
  persons,
  success: () => void,
  error: () => void,
) => {
  const collection = DB().collection('persons');
  collection.insert(persons);
  collection.save(err => {
    if (err) {
      error();
    } else {
      success();
    }
  });
};

const saveMatchesToDb = (
  data,
  success: () => void,
  error: () => void,
) => {
  const collection = DB().collection('matches');
  collection.insert(data);
  collection.save(err => {
    if (err) {
      error();
    } else {
      success();
    }
  });
};

export default {
  updates() {
    const lastActivityDate = LS.data.lastActivity;

    return new Promise((resolve, reject) => {
      API.post('/updates', { last_activity_date: lastActivityDate }).then(({ data }) => {
        const { matches, last_activity_date } = data;

        const parsedMatches: MatchType[] = [];
        const parsedPersons: PersonType[] = [];
        const parsedMessages: MessageType[] = [];

        each(matches, match => {
          if (!match.is_new_message) {
            parsedMatches.push(parseMatch(match, !!LS.data.lastActivity));
            parsedPersons.push(parsePerson(match.person));
          }
          processMessages(match);
        });

        LS.set({ lastActivity: last_activity_date });

        saveMatchesToDb(parsedMatches, () => {
          savePersonsToDb(parsedPersons, () => {
            resolve({
              matches: parsedMatches,
              persons: parsedPersons,
              messages: parsedMessages,
            });
          }, () => reject());
        }, () => reject());
      });
    });
  },

  sendMessage(matchId: string, message: string, payload: ?Object) {
    return new Promise((resolve, reject) => {
      API.post(`/user/matches/${matchId}`, { message, ...payload }).then(({ data }) => {
        const collection = DB().collection('messages');
        const parsedMessage = parseMessage(data);

        collection.insert(parsedMessage);
        collection.save();

        resolve(parsedMessage);
      }).catch(resp => reject(resp));
    });
  },

  block(matchId: string) {
    return new Promise((resolve, reject) => {
      API.del(`/user/matches/${matchId}`).then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  },

  updateProfile(payload: Object) {
    if (payload.age_filter_min < 18) {
      payload.age_filter_min = 18
    }

    if (payload.age_filter_max > 50) {
      payload.age_filter_max = 50
    }

    return API.post('profile', {
      bio: payload.bio,
      discoverable: payload.discoverable,
      gender_filter: payload.gender_filter,
      age_filter_min: payload.age_filter_min,
      age_filter_max: payload.age_filter_max,
      distance_filter: payload.distance_filter, // in MI
      squads_discoverable: payload.squads_discoverable,
    })
  }
};

export async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject();
  }
}

