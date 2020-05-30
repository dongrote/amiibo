'use strict';
const state = require('./state'),
  Websockets = require('../Websockets');

exports = module.exports = () => {
  Websockets.publish('reader', {connected: false});
  state.reader.reader = null;
  state.reader.connected = false;
};

