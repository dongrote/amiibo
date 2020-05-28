'use strict';
const EventEmitter = require('events');

class NTAG215 extends EventEmitter {
  PAGE_SIZE = 4;
  LOCKBYTES_PAGENO = 0x02;
  CC_PAGENO = 0x03;
  USER_PAGENO = 0x04;
  DLOCKBYTES_PAGENO = 0x82;
  CFG0_PAGENO = 0x83;
  CFG1_PAGENO = 0x84;
  PWD_PAGENO = 0x85;
  PACK_PAGENO = 0x86;

  constructor(reader) {
    super();
    this.reader = reader;
    this.reader.on('error', err => this.emit('error', err));
  }

  iso1443a_crc(buf) {
    let crc = 0x6363;
    buf.forEach(b => {
      const x = (b ^ (crc & 0x00ff)) & 0xff;
      const y = (x ^ (x << 4)) & 0xff;
      crc = ((crc >> 8) ^ (y << 8) ^ (y << 3) ^ (y >> 4)) & 0xffffffff;
    });
    return Buffer.from([crc & 0xff, (crc >> 8) & 0xff]);
  }

  iso1443b_crc(buf) {
    let crc = 0x0000ffff;
    buf.forEach(b => {
      const x = (b ^ (crc & 0x00ff)) & 0xff;
      const y = (x ^ (x << 4)) & 0xff;
      crc = ((crc >> 8) ^ (y << 8) ^ (y << 3) ^ (y >> 4)) & 0xffffffff;
    });
    crc = (~crc) & 0xffffffff;
    return Buffer.from([crc & 0xff, (crc >> 8) & 0xff]);
  }

  crc(buf) {
    return this.iso1443b_crc(buf);
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

  async serialNumber() {
    const read = await this.reader.read(0x00, 9);
    return Buffer.concat([
      read.slice(0, 3),
      read.slice(4, 8),
    ]);
  }

  async lockBytes() {
    const read = await this.reader.read(0x02, this.PAGE_SIZE);
    return read.slice(2, 4);
  }

  async dynamicLockBytes() {
    const rx = await this.reader.read(0x82 - this.PAGE_SIZE, 16);
    const bytes = rx.slice(12);
    if (bytes[3] !== 0xbd) {
      throw new Error(`expected byte 3 to equal 0xBD; instead received 0x${bytes.slice(3).toString('hex')}`);
    }
    return bytes;
  }

  async fullDump() {
    return await this.reader.read(0, 540);
  }

  async memorySize() {
    const bytes = await this.reader.read(this.CC_PAGENO, this.PAGE_SIZE);
    return bytes[2] * 8;
  }

  async pageIsLocked(pageno) {
    if (pageno < this.CC_PAGENO) return false;
    if (pageno > 0x0f) {
      // these are locked via dynamic lock bytes
      const lockBytes = await this.dynamicLockBytes();
      return pageno < this.DLOCKBYTES_PAGENO ? lockBytes[0] & (1 << ((pageno - 0x10) >> 1)) : false;
    }
    const lockBytes = await this.lockBytes();
    return pageno < 8 ? lockBytes[0] & (1 << pageno) : lockBytes[1] & (1 << (pageno - 0x08));
  }

  async writePACK(pack) {
    return await this.reader.write(this.PACK_PAGENO, Buffer.concat([pack, Buffer.from([0x00, 0x00])]))
  }

  async writePassword(password) {
    return await this.reader.write(this.PWD_PAGENO, password);
  }

}

exports = module.exports = NTAG215;
