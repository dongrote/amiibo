'use strict';
const EventEmitter = require('events');

class NTAG215 extends EventEmitter {
  constructor(reader) {
    super();
    this.reader = reader;
  }

  async serialNumber() {
    return await this.reader.read(0, 9);
  }

  capabilities() {

  }

  pageIsLocked(pageno) {

  }

  setPassword(password) {

  }


}

exports = module.exports = NTAG215;
