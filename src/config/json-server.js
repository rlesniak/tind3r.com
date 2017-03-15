var person = require('../mocks/person');

module.exports = function() {
  var data = { recs: { results: [] } }

  for (var i = 0; i < 5; i++) {
    data.recs.results.push({ user: person() })
  }
  return data
}
