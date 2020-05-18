'use strict';

const pcsclite = require('pcsclite');
const pcsc = pcsclite();
pcsc.on('reader', reader => {
  console.log('new reader detected', reader.name);
});
