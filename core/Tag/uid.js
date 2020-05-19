'use strict';
/**
 * remove the checksum bytes from the first two pages of a tag to get the uid
 */
exports = module.exports = page => Buffer.concat([page.slice(0, 3), page.slice(4, 8)]);
