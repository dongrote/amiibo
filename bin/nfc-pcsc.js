'use strict';
require('dotenv').config();
const _ = require('lodash');
const {NFC} = require('nfc-pcsc');
const core = require('../core');


core.AmiiboDatabase
  .load('./amiibo.json')
  .then(() => {
    const nfc = new NFC();
    nfc
      .on('reader', reader => {
        console.log(`${reader.reader.name} device connected`);
        reader
          .on('error', err => console.error('reader error', err))
          .on('end', () => console.log(`${reader.reader.name} device removed`))
          .on('card', card => {
            reader.read(0, 540)
              .then(data => {
                const amiibo = new core.Amiibo(reader);
                return amiibo.validateBlankTag()
                  .catch(err => console.error('tag is locked', err))
                  .then(() => core.Amiitool.decrypt(data))
                  .then(decrypted => {
                    console.log('first 9 bytes: ', data.slice(0, 9));
                    console.log('plaintext: ', decrypted.toString('hex'));
                    console.log('plaintext length: ', decrypted.length);
                    console.log('offset: ', 0x1d4);
                    console.dir(decrypted.slice(0x1d4, 0x1d4 + 9));
                    return core.Amiitool.encrypt(data);
                  })
                  .then(encrypted => {
                    console.log('re-encrypted:');
                    console.dir(encrypted);
                  })
                  .then(() => amiibo.id())
                  .then(id => {
                    console.log('id: ', id);
                    return core.AmiiboDatabase.lookupById(id);
                  })
                  .then(amiibo => console.log(`amiibo:`, _.get(amiibo, 'name', 'unknown')))
                  .then(() => amiibo.imageUrl())
                  .then(url => console.log('image url: ', url));
              })
              .then(() => {
                const ntag = new core.NTAG215(reader);
                return ntag.serialNumber()
                  .then(sn => console.log('serial number: ', sn.toString('hex')))
                  .then(() => ntag.fullDump())
                  .then(all => console.dir(all));
              })
              .catch(err => console.error('read error', err));
          });
      })
      .on('error', err => console.error('nfc error', err));
  })
  .catch(console.error);

