// @flow

import type { ActionsType } from 'types/person';

export type ActionType = {
  _id?: string,
  person_id: string,
  action_type: ActionsType,
  date: string,
  name: string,
  photo: string,
};
