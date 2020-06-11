'use strict';
require('dotenv').config();
const _ = require('lodash');
const {NFC} = require('nfc-pcsc');
const core = require('../core');

const amiiboBinFilePath = process.argv[2];
const amiiboBin = new core.AmiiboBinFile(amiiboBinFilePath);

amiiboBin
  .on('error', err => {
    console.error(err);
    process.exit(1);
  })
  .on('open', () => {
    console.log(`opened ${amiiboBin.path}`);
    const nfc = new NFC();
    nfc
      .on('reader', reader => {
        console.log('reader', reader.reader.name);
        reader.on('card', () => {
          console.log('card presented');
          const amiiboTag = new core.Amiibo(reader);
          amiiboTag.on('error', err => {
            console.error('amiibo error', err);
            process.exit(1);
          });
          amiiboTag.write(amiiboBin.data)
            .then(() => {
              console.log('write complete');
              process.exit(0);
            })
            .catch(err => {
              console.error('write error', err);
              process.exit(1);
            });
        });
        reader.on('card.off', () => console.log('card removed'));
      })
      .on('error', err => {
        console.error(err);
        process.exit(1);
      });
  });
