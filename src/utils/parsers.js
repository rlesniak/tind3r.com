// @flow

import { first, pick } from 'lodash';

import type { MatchType } from 'types/match';
import type { PersonType } from 'types/person';
import type { MessageType } from 'types/message';

export const parseMatch = (match: Object, isNew: boolean): MatchType => ({
  _id: match.id,
  person_id: first(match.participants),
  date: match.created_date,
  last_activity_date: match.last_activity_date,
  is_new: isNew,
  is_blocked: false,
  is_boost_match: match.is_boost_match,
  is_super_like: match.is_super_like,
  super_liker: match.super_liker,
});

export const parsePerson = (person: Object): PersonType => pick(person, [
  '_id', 'birth_date', 'ping_time', 'schools',
  'distance_mi', 'connection_count', 'common_friends',
  'bio', 'name', 'photos', 'gender', 'age',
]);

export const parseMessage = (message: Object): MessageType => ({
  _id: message._id,
  id: message._id,
  to_id: message.to,
  from_id: message.from,
  match_id: message.match_id,
  body: message.message,
  date: message.sent_date,
});
