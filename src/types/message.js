// @flow

export type MessageType = {
  _id: string;
  store?: Object;
  to_id?: ?string;
  from_id: string;
  match_id: string;
  body: string;
  date: Date;
};
