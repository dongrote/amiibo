'use strict';
const fs = require('fs'),
  Amiibo = require('../Amiibo'),
  filepath = require('./filepath'),
  BufferTagReader = require('../BufferTagReader');

exports = module.exports = amiiboData => {
  const reader = new BufferTagReader(amiiboData);
  const amiibo = new Amiibo(reader);
  return amiibo.id()
    .then(amiiboId => new Promise((resolve, reject) => {
      fs.writeFile(filepath(amiiboId), amiiboData, err => err ? reject(err) : resolve());
    }));
};
