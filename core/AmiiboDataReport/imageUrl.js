'use strict';
const BufferTagReader = require('../BufferTagReader'),
  Amiibo = require('../Amiibo');

exports = module.exports = data => {
  const reader = new BufferTagReader(data);
  const amiibo = new Amiibo(reader);
  return amiibo.imageUrl()
    .then(imageUrl => ({
      ok: true,
      value: imageUrl,
      error: null,
    }))
    .catch(err => ({
      ok: false,
      value: null,
      error: err.message,
    }));
};
