// @flow

import type { PersonType } from 'types/person';

export type MatchType = {
  _id: string,
  person_id: string,
  person?: PersonType,
  date: string,
  last_activity_date: string,
  is_new: boolean,
  is_blocked: boolean,
  is_boost_match: boolean,
  is_super_like: boolean,
  is_starred: boolean,
  last_msg_from_db?: Object,
  super_liker: string,
};

export type FiltersType = 'all' | 'new' | 'unread' | 'unanswered' | 'blocked' | 'superlike';
