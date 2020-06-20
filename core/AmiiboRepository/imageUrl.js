'use strict';
const Amiibo = require('../Amiibo'),
  BufferTagReader = require('../BufferTagReader'),
  fs = require('fs');

exports = module.exports = filepath => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => err ? reject(err) : resolve(data));
})
.then(tagData => {
  const reader = new BufferTagReader(tagData);
  const amiibo = new Amiibo(reader);
  return amiibo.imageUrl();
});
