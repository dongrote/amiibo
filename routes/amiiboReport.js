'use strict';
const _ = require('lodash'),
  HttpError = require('http-error-constructor'),
  core = require('../core');

exports = module.exports = (req, res, next) => {
  if (!req.file) {
    return Promise.resolve(next(new HttpError(400, 'missing file')));
  }
  return core.AmiiboDataReport.generate(req.file.buffer)
    .then(report => res.json(report))
    .catch(next);
};
