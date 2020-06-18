'use strict';
const fs = require('fs'),
  path = require('path'),
  env = require('../../env');

exports = module.exports = amiiboFilename => new Promise((resolve, reject) => {
  fs.readFile(path.join(env.amiiboDirectory(), amiiboFilename), (err, data) => err ? reject(err) : resolve(data));
});
