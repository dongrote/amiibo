'use strict';
const NTAG215 = require('./NTAG215');
/*
class Amiibo {
  AMIIBO_ID_OFFSET = 0x54;
  AMIIBO_ID_LENGTH = 0x8;
  constructor(payload) {
    this.payload = payload;
  }

  uid() {
    return Buffer.concat([
      this.payload.slice(0, 3),
      this.payload.slice(4, 8),
    ]);
  }

  amiiboId() {
   return this.payload.slice(this.AMIIBO_ID_OFFSET, this.AMIIBO_ID_OFFSET + this.AMIIBO_ID_LENGTH);
  }

  validate() {

  }

  keygen() {
    const uid = this.uid();
    const key = uid.length === 7 ? Buffer.allocUnsafe(4) : null;
    if (uid.length === 7) {
      key.writeUInt8((0xff & (0xaa ^ (uid[1] ^ uid[3]))), 0);
      key.writeUInt8((0xff & (0x55 ^ (uid[2] ^ uid[4]))), 1);
      key.writeUInt8((0xff & (0xaa ^ (uid[3] ^ uid[5]))), 2);
      key.writeUInt8((0xff & (0x55 ^ (uid[4] ^ uid[6]))), 3);
    }
    return key;
  }

  auth() {
    const password = this.keygen();
    const preamble = Buffer.allocUnsafe(1);
    preamble.writeUInt8(0x1b);
    const auth = Buffer.concat([preamble, password]);
    
  }
}
*/

class Amiibo extends NTAG215 {
  AMIIBO_ID_BLOCK_NUMBER = 0x15;
  AMIIBO_ID_LENGTH = 0x8;
  async password() {
    const uid = await this.serialNumber();
    const key = uid.length === 7 ? Buffer.allocUnsafe(4) : null;
    if (uid.length === 7) {
      key.writeUInt8((0xff & (0xaa ^ (uid[1] ^ uid[3]))), 0);
      key.writeUInt8((0xff & (0x55 ^ (uid[2] ^ uid[4]))), 1);
      key.writeUInt8((0xff & (0xaa ^ (uid[3] ^ uid[5]))), 2);
      key.writeUInt8((0xff & (0x55 ^ (uid[4] ^ uid[6]))), 3);
    }
    return key;
  }

  async id() {
    const rx = await this.reader.read(this.AMIIBO_ID_BLOCK_NUMBER, this.AMIIBO_ID_LENGTH);
    return rx.toString('hex');
  }
}

exports = module.exports = Amiibo;
