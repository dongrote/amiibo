'use strict';
const state = require('./state'),
  Amiibo = require('../Amiibo'),
  Websockets = require('../Websockets'),
  log = require('debug-logger')('core:System:cardPresented');

exports = module.exports = (reader, card) => {
  Websockets.publish('card', {present: true});
  state.card.card = card;
  state.card.present = true;
  return reader.read(0, 540)
    .then(data => {
      state.card.fullRead = data;
      const amiibo = new Amiibo(reader);
      return amiibo.id()
        .then(amiiboId => {
          state.amiibo = {id: amiiboId};
          return amiibo.imageUrl();
        })
        .then(amiiboImageUrl => {
          state.amiibo.imageUrl = amiiboImageUrl;
          Websockets.publish('amiibo', state.amiibo);
        });
    })
    .catch(log.error);
};
