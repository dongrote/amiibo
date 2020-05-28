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
    return rx.readInt32BE();
  }

  async tail() {
    const rx = await this.reader.read(this.TAIL_BLOCK_NUMBER, this.TAIL_LENGTH);
    return rx.readInt32BE();
  }

  async imageUrl() {
    const head = await this.head();
    const tail = await this.tail();
    return `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_${head.toString(16).padStart(8, '0')}-${tail.toString(16).padStart(8, '0')}.png`;
  }

  async validateBlankTag() {
    const lockBytes = await this.lockBytes();
    if (lockBytes[0] === 0x0f && lockBytes[1] === 0xe0) {
      throw new Error('tag is already an Amiibo');
    }
  }

  async writeUserMemory(amiiboData) {
    return await this.reader.write(this.CC_PAGENO, amiiboData.slice(3 * this.PAGE_SIZE, 130 * this.PAGE_SIZE));
  }

  async writeLockInfo() {
    const pageTwo = await this.reader.read(2, this.PAGE_SIZE);
    pageTwo[2] = 0x0f;
    pageTwo[3] = 0xe0;
    await this.reader.write(2, pageTwo);
    await this.reader.write(this.DLOCKBYTES_PAGENO, Buffer.from([0x01, 0x00, 0x0f, 0x00]));
    await this.reader.write(this.CFG0_PAGENO, Buffer.from([0x00, 0x00, 0x00, 0x04]));
    await this.reader.write(this.CFG1_PAGENO, Buffer.from([0x5f, 0x00, 0x00, 0x00]));
  }

  async write(amiiboData) {
    await this.validateBlankTag();
    await this.writeUserMemory(amiiboData);
    const password = await this.password();
    await this.writePACK(Buffer.from([0x80, 0x80]));
    await this.writePassword(password);
    await this.writeLockInfo();
  }

}

exports = module.exports = Amiibo;
