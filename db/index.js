var recs = require('./recs.json')
var updates = require('./updates.json')
var meta = require('./meta.json')
var user = require('./user.json')

module.exports = function() {
  return {
    recs: recs,
    updates: updates,
    meta: meta,
    user: user,
  }
}
