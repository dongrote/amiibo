'use strict';
const core = require('../core');

exports = module.exports = (req, res, next) => core.AmiiboRepository.available()
  .then(available => res.json(available))
  .catch(next);
