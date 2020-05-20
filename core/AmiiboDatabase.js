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
          resolve(this);
        });
    });
  }

  lookupAmiiboById(id) {
    return Promise.resolve(_.get(this.db, `amiibos.0x${id}`, null));
  }
}

exports = module.exports = AmiiboDatabase;
