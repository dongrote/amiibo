'use strict';
const fs = require('fs'),
  filepath = require('./filepath');

exports = module.exports = amiiboId => new Promise((resolve, reject) => {
  fs.readFile(filepath(amiiboId), (err, data) => err ? reject(err) : resolve(data));
});
