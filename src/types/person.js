// @flow

export type PersonType = {
  id: string,
  birth_date: string,
  ping_time: string,
  schools: [],
  distance_mi: number,
  instagram?: {
    username: string,
  }
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
