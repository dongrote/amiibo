'use strict';
const core = require('../core');

exports = module.exports = (req, res, next) => core.System.state()
  .then(state => res.json(state))
  .catch(next);
