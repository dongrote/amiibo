'use strict';


const checkChange = (reader, status, constant) => ((reader.state ^ status.state) & reader[constant]) && (status.state & reader[constant]);
const cardRemoved = (reader, status) => checkChange(reader, status, 'SCARD_STATE_EMPTY');
const cardPresented = (reader, status) => checkChange(reader, status, 'SCARD_STATE_PRESENT');

const pcsclite = require('pcsclite');
const pcsc = pcsclite();
pcsc
  .on('reader', reader => {
    console.log('new reader detected', reader.name);
    reader.on('error', console.error);
    reader.on('status', status => {
      const changes = reader.state ^ status.state;
      console.log(`changes: ${Number(changes).toString(16)}`);
      if (changes) {
        console.log('changes detected');
        if (cardRemoved(reader, status)) {
          console.log('card removed');
        }
        if (cardPresented(reader, status)) {
          console.log('card presented');
        }
      } else {
        console.log('no changes detected');
      }
    });
    reader.on('end', () => console.log(`${reader.name} disconnected`));
  })
  .on('error', err => console.error('pcsc', err));
