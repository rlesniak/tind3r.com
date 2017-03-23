// @flow

export type MatchType = {
  id: string,
  person_id: string,
  date: string,
  last_activity_date: string,
  is_new: 0 | 1,
  is_boost_match: 0 | 1,
  is_super_like: 0 | 1,
  participants: [],
};
