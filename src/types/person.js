// @flow

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

export type InstagramType = {
  username: string,
  id: string,
}

export type ActionsType = 'pass' | 'superlike' | 'like';
