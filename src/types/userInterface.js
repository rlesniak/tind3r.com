// @flow

export interface UserInterface {
  _id: string,
  photos: ?[],
  name: string,
  +mainPhoto: string,
}
