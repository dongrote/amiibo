'use strict';
const env = require('../../env'),
  fs = require('fs');

exports = module.exports = () => new Promise((resolve, reject) => {
  fs.readdir(env.amiiboDirectory(), (err, files) => err ? reject(err) : resolve(files));
});
