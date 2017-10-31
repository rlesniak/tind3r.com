// @flow

export interface UserInterface {
  _id: string,
  photos: ?Object[],
  name: string,
  +mainPhoto: string,
}
