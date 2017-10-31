/* eslint-disable */

const person = require('../mocks/person').person;
const updates = require('../mocks/updates');
const meta = require('../mocks/meta');
const like = require('../mocks/like');
const superlike = require('../mocks/superlike');

module.exports = function () {
  const data = {
    recs: { results: [] },
    updates: updates(),
    meta,
    like,
    superlike,
  };


  for (let i = 0; i < 5; i++) {
    data.recs.results.push({ user: person() });
  }

  return data;
};
