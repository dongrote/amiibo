'use strict';
const _ = require('lodash'),
  state = require('./state');

exports = module.exports = id => {
  if (!state.db) {
    return Promise.reject(new Error('database not loaded'));
  }
  const lookupKey = `amiibos.0x${id}`;
  return Promise.resolve(_.get(state.db, lookupKey, null));
};
