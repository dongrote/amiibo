'use strict';
const _ = require('lodash'),
  env = require('../../env'),
  path = require('path'),
  fs = require('fs');

exports = module.exports = (amiiboData, filename) => {
  const amiiboFilePath = path.join(env.amiiboDirectory(), filename),
    amiiboDataLength = _.size(amiiboData);
  return amiiboDataLength === 540
    ? new Promise((resolve, reject) => {
        fs.access(amiiboFilePath, err => err ? resolve() : reject(new Error('already exists')));
      })
      .then(() => new Promise((resolve, reject) => {
        fs.writeFile(amiiboFilePath, amiiboData, err => err ? reject(err) : resolve());
      }))
    : Promise.reject(new Error(`invalid Amiibo file size: ${amiiboDataLength}`));
};
