'use strict';
const _ = require('lodash'),
  HttpError = require('http-error-constructor'),
  core = require('../core');

exports = module.exports = (req, res, next) => {
  const filename = _.get(req.query, 'amiibo');
  if (!filename) {
    return Promise.resolve(next(new HttpError(400, 'missing amiibo')));
  }
  return core.AmiiboRepository.read(filename)
    .then(amiiboData => {
      const reader = new core.BufferTagReader(amiiboData);
      const amiibo = new core.Amiibo(reader);
      return Promise.all([amiibo.id(), amiibo.imageUrl()]);
    })
    .then(([amiiboId, imageUrl]) => core.AmiiboDatabase.lookupById(amiiboId)
      .then(character => res.json({
        imageUrl,
        name: _.get(character, 'name', filename),
      })))
    .catch(next);
};
