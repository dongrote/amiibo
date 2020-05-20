'use strict';
const _ = require('lodash'),
  log = require('debug-logger')('AmiiboDatabase'),
  fs = require('fs');

class AmiiboDatabase {
  db = {};
  load(dbpath) {
    return new Promise((resolve, reject) => {
      let jsonData = Buffer.from('');
      fs.createReadStream(dbpath)
        .on('error', reject)
        .on('data', chunk => {
          jsonData = Buffer.concat([jsonData, chunk]);
        })
        .on('end', () => {
          this.db = JSON.parse(jsonData.toString());
          log.info('database populated');
          log.debug(`${_.size(this.db.amiibos)} amiibos loaded`);
          resolve(this);
        });
    });
  }

  lookupAmiiboById(id) {
    const lookupKey = `amiibos.0x${id}`;
    log.debug('looking up', lookupKey);
    log.debug('amiibo ids', _.keys(_.get(this.db, 'amiibos', {})));
    log.debug(`${_.has(this.db, lookupKey) ? 'has' : 'does not have'} "${id}"`);
    return Promise.resolve(_.get(this.db, lookupKey, null));
  }
}

exports = module.exports = AmiiboDatabase;
