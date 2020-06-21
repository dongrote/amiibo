'use strict';
const BufferTagReader = require('../BufferTagReader'),
  Amiibo = require('../Amiibo');

exports = module.exports = data => {
  const reader = new BufferTagReader(data);
  const amiibo = new Amiibo(reader);
  return amiibo.id()
    .then(amiiboId => ({
      ok: true,
      value: amiiboId,
      error: null,
    }))
    .catch(err => ({
      ok: false,
      value: null,
      error: err.message,
    }));
};
