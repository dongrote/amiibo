'use strict';
const env = require('../../env'),
  path = require('path');

exports = module.exports = amiiboId => path.join(env.amiiboDirectory(), `${amiiboId}.bin`);
