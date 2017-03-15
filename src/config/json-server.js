const person = require('../mocks/person');
const updates = require('../mocks/updates');

module.exports = function () {
  const data = {
    recs: { results: [] },
    updates: updates(),
  };


  for (let i = 0; i < 5; i++) {
    data.recs.results.push({ user: person() });
  }

  return data;
};
