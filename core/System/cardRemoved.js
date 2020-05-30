'use strict';
const state = require('./state'),
  Websockets = require('../Websockets');

exports = module.exports = () => {
  Websockets.publish('card', {present: false});
  state.card.card = null;
  state.card.present = false;
  state.amiibo = null;
};
