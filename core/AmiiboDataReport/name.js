'use strict';
const BufferTagReader = require('../BufferTagReader'),
  Amiibo = require('../Amiibo'),
  AmiiboDatabase = require('../AmiiboDatabase');

exports = module.exports = data => {
  const reader = new BufferTagReader(data);
  const amiibo = new Amiibo(reader);
  return amiibo.id()
    .then(amiiboId => AmiiboDatabase.lookupById(amiiboId))
    .then(amiiboCharacter => ({
      ok: true,
      value: amiiboCharacter.name,
      error: null,
    }))
    .catch(err => ({
      ok: false,
      value: null,
      error: err.message,
    }));
};
