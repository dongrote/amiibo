'use strict';
const fs = require('fs'),
  state = require('./state');

exports = module.exports = dbpath => new Promise((resolve, reject) => {
  let jsonData = Buffer.from('');
  fs.createReadStream(dbpath)
    .on('error', reject)
    .on('data', chunk => {
      jsonData = Buffer.concat([jsonData, chunk]);
    })
    .on('end', () => {
      state.db = JSON.parse(jsonData.toString());
      log.info('database populated');
      log.debug(`${_.size(this.db.amiibos)} amiibos loaded`);
      resolve();
    });
});
