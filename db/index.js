var recs = require('./recs.json')
var updates = require('./updates.json')

module.exports = function() {
  return {
    recs: recs,
    updates: updates,
  }
}
