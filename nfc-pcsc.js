'use strict';
const _ = require('lodash');
const {NFC} = require('nfc-pcsc');
const nfc = new NFC();
const core = require('./core');


const db = new core.AmiiboDatabase();

db.load('./amiibo.json').catch(console.error);
    

nfc
  .on('reader', reader => {
    reader
      .on('error', err => console.error('reader error', err))
      .on('end', () => console.log(`${reader.reader.name} device removed`))
      .on('card', card => {
        reader.read(0, 540)
          .then(data => {
            const amiibo = new core.Amiibo(data);
            return db.lookupAmiiboById(amiibo.amiiboId().toString('hex'));
          })
          .then(amiibo => console.log(`amiibo:`, _.get(amiibo, 'name', 'unknown')))
          .then(() => {
            const ntag = new core.NTAG215(reader);
            return ntag.serialNumber().then(sn => console.log('serial number: ', sn.toString('hex')));
          })
          .catch(err => console.error('read error', err));
      });
})
.on('error', err => console.error('nfc error', err));
