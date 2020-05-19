'use strict';

const {NFC} = require('nfc-pcsc');
const nfc = new NFC();

nfc
  .on('reader', reader => {
    reader
      .on('error', err => console.error('reader error', err))
      .on('end', () => console.log(`${reader.reader.name} device removed`))
      .on('card', card => console.log(`card inserted`, card))
      .on('card.off', card => console.log(`card removed`, card));
  })
  .on('error', err => console.error('nfc error', err));
