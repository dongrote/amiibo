'use strict';
const state = require('./state'),
  Websockets = require('../Websockets');

exports = module.exports = card => {
  Websockets.publish('card', {present: true});
  state.card.card = card;
  state.card.present = true;
};
