// @flow

export type InstagramType = {
  username: string,
  completed_initial_fetch: boolean,
  last_fetch_time: string,
  media_count: number,
  photos: [],
  profile_picture: string,
  username: string,
}

export type PersonType = {
  _id: string,
  birth_date: string,
  ping_time: string,
  schools: [],
  distance_mi: number,
  instagram?: InstagramType,
  connection_count: [],
  common_friends: [],
  bio: string,
  name: string,
  photos: [],
  gender: number,
  distance_mi: number,
  age: string,
}

export type SchoolType = {
  name: string,
  id: string,
}

export type ActionsType = 'pass' | 'superlike' | 'like';
