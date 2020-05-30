'use strict';
const state = require('./state'),
  Amiibo = require('../Amiibo'),
  AmiiboDatabase = require('../AmiiboDatabase'),
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
          return Promise.all([amiibo.imageUrl(), AmiiboDatabase.lookupById(amiiboId)]);
        })
        .then(([amiiboImageUrl, amiiboCharacter]) => {
          state.amiibo.imageUrl = amiiboImageUrl;
          state.amiibo.character = amiiboCharacter;
          Websockets.publish('amiibo', state.amiibo);
        });
    })
    .catch(log.error);
};
