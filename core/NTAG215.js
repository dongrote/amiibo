'use strict';
const EventEmitter = require('events');

class NTAG215 extends EventEmitter {
  constructor(reader) {
    super();
    this.reader = reader;
  }

  async serialNumber() {
    const read = await this.reader.read(0, 9);
    return Buffer.concat([
      read.slice(0, 3),
      read.slice(4, 8),
    ]);
  }

  async lockBytes() {
    const read = await this.reader.read(2, 4);
    return read.slice(2, 4);
  }

  capabilities() {

  }

  async pageIsLocked(pageno) {
    if (pageno < 3) return false;
    if (pageno > 15) return false;
    const lockBytes = await this.lockBytes();
    return pageno < 8 ? lockBytes[0] & (1 << pageno) : lockBytes[1] & (1 << (pageno - 8));
  }

  setPassword(password) {

  }


}

exports = module.exports = NTAG215;
