'use strict';
const _ = require('lodash'),
  state = require('./state');

exports = module.exports = name => new Promise((resolve, reject) => {
  if (!state.db) {
    return Promise.reject(new Error('database not loaded'));
  }
  const lowerName = _.toLower(name);
  const amiiboIds = _.filter(_.get(state.db, 'amiibos', {}), value => _.includes(_.toLower(_.get(value, 'name', '')), lowerName));
  return Promise.resolve(amiiboIds);
});
