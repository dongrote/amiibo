'use strict';
const state = require('./state');

exports = module.exports = io => {
  if (io) {
    state.io = io;
  }
  return state.io;
};
