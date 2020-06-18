'use strict';
const _ = require('lodash');

exports = module.exports = {
  port: () => Number(_.get(process.env, 'PORT', 3000)),
  amiiboDirectory: () => _.get(process.env, 'AMIIBO_DIRECTORY', '.'),
  amiitoolKeySetFilePath: () => _.get(process.env, 'AMIITOOL_KEY_SET_FILE_PATH'),
  amiiboWriteGraceTimeout: () => Number(_.get(process.env, 'AMIIBO_WRITE_GRACE_TIMEOUT', 5)) * 1000,
};
