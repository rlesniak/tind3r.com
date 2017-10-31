/* eslint-disable */

const person = require('./person').person;
const casual = require('casual');

const downloaded = false;

const matches = () => {
  const data = [];

  for (let i = 0; i < 0; i++) {
    const id = casual.uuid;
    const personId = casual.uuid;

    data.push({
      _id: id,
      closed: false,
      common_friend_count: 0,
      common_like_count: 0,
      created_date: '2017-03-14T18:46:32.953Z',
      dead: false,
      last_activity_date: '2017-03-14T18:46:32.953Z',
      message_count: 0,
      messages: [],
      participants: [personId],
      pending: false,
      is_super_like: false,
      is_boost_match: false,
      following: true,
      following_moments: true,
      id,
      person: person(personId),
    });
  }

  return data;
};

const matchesWithMsg = () => {
  const data = [];

  for (let i = 0; i < 0; i++) {
    const id = casual.uuid;
    const personId = casual.uuid;
    const personIdTo = casual.uuid;
    const messages = [];

    for (let i = 0; i < 43; i++) {
      messages.push({
        _id: casual.uuid,
        match_id: id,
        to: personIdTo,
        from: personId,
        message: casual.sentence,
        sent_date: '2017-03-14T20:28:39.101Z',
        created_date: '2017-03-14T20:28:39.101Z',
        timestamp: 1489523319101,
      });
    }

    data.push({
      _id: id,
      closed: false,
      common_friend_count: 0,
      common_like_count: 0,
      created_date: '2017-03-14T18:46:32.953Z',
      dead: false,
      last_activity_date: '2017-03-14T18:46:32.953Z',
      message_count: 0,
      participants: [personId],
      pending: false,
      is_super_like: false,
      is_boost_match: false,
      following: true,
      following_moments: true,
      id,
      person: person(personId),
      messages,
    });
  }

  return data;
};

const updates = () => ({
  matches: matches().concat(matchesWithMsg()),
  blocks: [],
  lists: [],
  deleted_lists: [],
  liked_messages: [],
  squads: [],
  goingout: [],
  last_activity_date: '2017-03-15T14:32:16.908Z',
});

module.exports = updates;
