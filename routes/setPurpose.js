'use strict';
const _ = require('lodash'),
  core = require('../core');

exports = module.exports = (req, res, next) => {
  const purpose = _.get(req.query, 'purpose');
  return core.System.setPurpose(purpose)
    .then(() => res.sendStatus(204))
    .catch(next);
};
