'use strict';

const {NFC} = require('nfc-pcsc');
const nfc = new NFC();
const core = require('./core');

nfc
  .on('reader', reader => {
    reader
      .on('error', err => console.error('reader error', err))
      .on('end', () => console.log(`${reader.reader.name} device removed`))
      .on('card', card => {
        console.log(`card inserted`, card);
        reader.read(0, 540)
          .then(data => {
            const amiibo = new core.Amiibo(data);
            console.log('uid', amiibo.uid().toString('hex'));
            console.log('amiibo id', amiibo.amiiboId().toString('hex'));
          })
          .catch(err => console.error('read error', err));
      })
      .on('card.off', () => console.log(`card removed`));
  })
  .on('error', err => console.error('nfc error', err));
