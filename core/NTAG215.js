'use strict';
const EventEmitter = require('events');

class NTAG215 extends EventEmitter {

  constructor(reader) {
    super();
    this.reader = reader;
    this.reader.on('error', err => this.emit('error', err));
  }

  crc(buf) {
    let crc = 0x6363;
    buf.forEach(b => {
      const x = (b ^ (crc & 0x00ff)) & 0xff;
      const y = (x ^ (x << 4)) & 0xff;
      crc = ((crc >> 8) ^ (y << 8) ^ (y << 3) ^ (y >> 4)) & 0xffffffff;
    });
    return Buffer.from([crc & 0xff, (crc >> 8) & 0xff]);
  }

  async transmit(buf, responseLength) {
    return await this.reader.transmit(Buffer.concat([buf, this.crc(buf)]), responseLength);
  }

  async getVersion() {
    try {
      const rx = await this.transmit(Buffer.from([0x60]), 8);
      if (rx.length !== 8) {
        throw new Error('GET_VERSION error');
      }
    } catch (err) {
      throw err;
    }
    return rx;
  }

  async validate() {
    const versionInfo = await this.getVersion();
    console.dir(versionInfo);
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
    const rx = await this.reader.read(0x82 - 4, 16);
    const bytes = rx.slice(12);
    if (bytes[3] !== 0xbd) {
      throw new Error(`expected byte 3 to equal 0xBD; instead received 0x${bytes.slice(3).toString('hex')}`);
    }
    return bytes;
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
      return pageno < 0x82 ? lockBytes[0] & (1 << ((pageno - 0x10) >> 1)) : false;
    }
    const lockBytes = await this.lockBytes();
    return pageno < 8 ? lockBytes[0] & (1 << pageno) : lockBytes[1] & (1 << (pageno - 0x08));
  }

  setPassword(password) {

  }


}

exports = module.exports = NTAG215;
