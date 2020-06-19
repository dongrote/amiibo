'use strict';
const _ = require('lodash'),
  HttpError = require('http-error-constructor'),
  path = require('path'),
  core = require('../core');

exports = module.exports = (req, res, next) => {
  const amiibo = path.basename(_.get(req.query, 'amiibo', ''));
  if (_.size(amiibo) === 0) {
    return Promise.resolve(next(new HttpError(400, `invalid amiibo: '${amiibo}'`)));
  }
  return core.System.setAmiibo(amiibo)
    .then(() => res.sendStatus(204))
    .catch(next);
};
