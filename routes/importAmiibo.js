'use strict';
const HttpError = require('http-error-constructor'),
  core = require('../core');

exports = module.exports = (req, res, next) => req.file
  ? core.AmiiboRepository.import(req.file.buffer, req.file.originalname)
    .then(() => res.sendStatus(204))
    .catch(err => next(new HttpError(400, err.message)))
  : Promise.resolve(next(new HttpError(400, 'missing file')));
