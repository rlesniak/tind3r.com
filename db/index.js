var recs = require('./recs.json')
var updates = require('./updates.json')
var meta = require('./meta.json')

module.exports = function() {
  return {
    recs: recs,
    updates: updates,
    meta: meta,
  }
}
