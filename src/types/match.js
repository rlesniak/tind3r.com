// @flow

import type { PersonType } from '../types/person';

export type MatchType = {
  _id: string,
  person_id: string,
  person?: PersonType,
  date: string,
  last_activity_date: string,
  is_new: boolean,
  is_boost_match: 0 | 1,
  is_super_like: 0 | 1,
  last_msg_from_db?: Object,
};
