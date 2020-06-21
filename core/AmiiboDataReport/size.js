'use strict';
const _ = require('lodash');

exports = module.exports = data => Promise.resolve({
  ok: _.size(data) === 540,
  value: _.size(data),
  error: _.size(data) === 540 ? '' : `file size should be 540 bytes; got ${_.size(data)} instead`,
});
