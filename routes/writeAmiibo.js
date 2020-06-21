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
    .then(amiiboData => core.System.writeAmiibo(amiiboData))
    .then(() => res.sendStatus(204))
    .catch(err => next(new HttpError(400, err.message)));
};
