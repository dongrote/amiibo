'use strict';
const EventEmitter = require('events');

class NTAG215 extends EventEmitter {
  constructor(reader) {
    super();
    this.reader = reader;
  }

  async serialNumber() {
    const read = await this.reader.read(0x00, 9);
    return Buffer.concat([
      read.slice(0, 3),
      read.slice(4, 8),
    ]);
  }

  async lockBytes() {
    const read = await this.reader.read(0x02, 4);
    return read.slice(2, 4);
  }

  async dynamicLockBytes() {
    return await this.reader.read(0x82, 3);
  }

  capabilities() {

  }

  async fullDump() {
    return await this.reader.read(0, 540);
  }

  async memorySize() {
    const bytes = await this.reader.read(0x03, 4);
    return bytes[2] * 8;
  }

  async pageIsLocked(pageno) {
    if (pageno < 0x03) return false;
    if (pageno > 0x0f) {
      // these are locked via dynamic lock bytes
      const lockBytes = await this.dynamicLockBytes();
      return pageno < 130 ? lockBytes[0] & (1 << ((pageno - 0x10) >> 1)) : false;
    }
    const lockBytes = await this.lockBytes();
    return pageno < 8 ? lockBytes[0] & (1 << pageno) : lockBytes[1] & (1 << (pageno - 0x08));
  }

  setPassword(password) {

  }


}

exports = module.exports = NTAG215;
