'use strict';

const pcsclite = require('pcsclite');
const pcsc = pcsclite();
pcsc.on('reader', reader => {
  console.log('new reader detected', reader.name);
  reader.on('error', console.error);
  reader.on('status', function(status) {
    console.dir(this);
    console.log(`status: ${status}`);
  });
});
