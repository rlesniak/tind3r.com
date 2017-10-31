// @flow

import { each } from 'lodash';
import LogRocket from 'logrocket';

import API from 'utils/api';
import LS from 'utils/localStorage';
import { collections, updateMatch } from 'utils/database.v2';
import { parseMatch, parsePerson, parseMessage } from 'utils/parsers';

import type { MatchType } from 'types/match';
import type { PersonType } from 'types/person';
import type { MessageType } from 'types/message';

const processMessages = (messages) => {
  if (messages.length === 0) return;

  const collection = collections.messages;
  collection.insert(messages);
  collection.save();
};

const MAX_TRY = 5;
let personsTryCount = 0;

const savePersonsToDb = (
  persons,
  success: () => void,
  error: () => void,
) => {
  const collection = collections.persons;
  collection.insert(persons);
  collection.save((err) => {
    if (err) {
      if (personsTryCount > MAX_TRY) {
        personsTryCount = 0;
        error(err);
      } else {
        personsTryCount += 1;
        savePersonsToDb(persons, success, error);
      }
    } else {
      personsTryCount = 0;
      success();
    }
  });
};

let matchesTryCount = 0;
const saveMatchesToDb = (
  data,
  success: () => void,
  error: () => void,
) => {
  const collection = collections.matches;
  collection.insert(data);
  collection.save((err) => {
    if (err) {
      if (matchesTryCount > MAX_TRY) {
        error(err);
        matchesTryCount = 0;
      } else {
        matchesTryCount += 1;
        saveMatchesToDb(data, success, error);
      }
    } else {
      matchesTryCount = 0;
      success();
    }
  });
};

const createBlocks = (matchIds: Array<string>) => {
  if (matchIds.length === 0) return;
  updateMatch(matchIds, { is_blocked: true });
};

const getMessages = (matches) => {
  const arr = [];

  each(matches, (match) => {
    each(match.messages, (msg) => {
      arr.push(parseMessage(msg));
    });

    if (match.is_new_message) {
      updateMatch([match._id], { is_new: true });
    }
  });

  return arr;
};

export default {
  updates() {
    const lastActivityDate = LS.data.lastActivity;

    return new Promise((resolve, reject) => {
      const isFirstFetch = !lastActivityDate;

      API.post('/updates', { last_activity_date: lastActivityDate }).then(({ data }) => {
        const { matches, last_activity_date, blocks } = data;

        const parsedMatches: MatchType[] = [];
        const parsedPersons: PersonType[] = [];
        const parsedMessages: MessageType[] = [];

        each(matches, (match) => {
          if (!match._id) return; // when group match

          if (!match.is_new_message) {
            parsedMatches.push(parseMatch(match, !isFirstFetch));
          }

          if (match.person) {
            parsedPersons.push(parsePerson(match.person));
          }
        });

        processMessages(getMessages(matches));

        if (!isFirstFetch) {
          createBlocks(blocks);
        }

        if (parsedMatches.length) {
          const obj = { matches: parsedMatches.length, persons: parsedPersons.length };
          LogRocket.info('fetch update', obj);

          if (window.Bugsnag && obj.matches !== obj.persons) {
            window.Bugsnag.notify('fetch-service', 'fetch update', obj);
          }

          saveMatchesToDb(parsedMatches, () => {
            savePersonsToDb(parsedPersons, () => {
              resolve({
                matches: parsedMatches,
                persons: parsedPersons,
                messages: parsedMessages,
              });
            }, err => reject({ type: 'persons-db', data: err }));
          }, err => reject({ type: 'matches-db', data: err, size: parsedMatches.length }));
        } else {
          resolve({
            matches: [],
            persons: [],
            messages: [],
          });
        }

        LS.set({ lastActivity: last_activity_date });
      }).catch(reject);
    });
  },

  sendMessage(matchId: string, message: string, payload: ?Object) {
    return new Promise((resolve, reject) => {
      API.post(`/user/matches/${matchId}`, { message, ...payload }).then(({ data }) => {
        const collection = collections.messages;
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
      payload.age_filter_min = 18; // eslint-disable-line
    }

    return API.post('profile', {
      bio: payload.bio,
      discoverable: payload.discoverable,
      gender_filter: payload.gender_filter,
      age_filter_min: payload.age_filter_min,
      age_filter_max: payload.age_filter_max,
      distance_filter: payload.distance_filter, // in MI
      squads_discoverable: payload.squads_discoverable,
    });
  },
};

export async function meta() {
  try {
    const { data } = await API.get('/meta');

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject();
  }
}

