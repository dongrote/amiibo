'use strict';
const state = require('./state'),
  Websockets = require('../Websockets');

exports = module.exports = reader => {
  Websockets.publish('reader', {connected: true});
  state.reader.reader = reader;
  state.reader.connected = true;
};
