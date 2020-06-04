'use strict';
const _ = require('lodash');

exports = module.exports = {
  port: () => Number(_.get(process.env, 'PORT', 3000)),
  amiiboDirectory: () => _.get(process.env, 'AMIIBO_DIRECTORY', '.'),
};
