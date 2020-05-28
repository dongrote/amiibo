'use strict';
const NTAG215 = require('./NTAG215');

class Amiibo extends NTAG215 {
  HEAD_BLOCK_NUMBER = 0x15;
  HEAD_LENGTH = 0x4;
  TAIL_BLOCK_NUMBER = 0x16;
  TAIL_LENGTH = 0x4;
  HEAD_MASK = 0xFFFFFFFF00000000;
  TAIL_MASK = 0x00000000FFFFFFFF;
  HEAD_SHIFT = 32;
  TAIL_SHIFT = 0;
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

  async head() {
    const rx = await this.reader.read(this.HEAD_BLOCK_NUMBER, this.HEAD_LENGTH);
    return rx.readInt32LE();
  }

  async tail() {
    const rx = await this.reader.read(this.TAIL_BLOCK_NUMBER, this.TAIL_LENGTH);
    return rx.readInt32LE();
  }

  async imageUrl() {
    const head = await this.head();
    const tail = await this.tail();
    return `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_${head.toString(16).padStart(8, '0')}-${tail.toString(16).padStart(8, '0')}.png`;
  }
}

exports = module.exports = Amiibo;
