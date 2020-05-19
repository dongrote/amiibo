'use strict';
/**
 * remove the checksum bytes from the first two pages of a tag to get the uid
 */
exports = module.exports = page => page.slice(7, 7+8);
