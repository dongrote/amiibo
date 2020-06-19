'use strict';
/**
 * A Buffer-based pseudo tag reader/writer
 */
const EventEmitter = require('events');

class BufferTagReader extends EventEmitter {
  TOTAL_LENGTH = 540;
  PAGE_SIZE = 4;
  buffer = Buffer.alloc(540);

  constructor(data) {
    super();
    this.PAGE_SIZE = 4;
    this.TOTAL_LENGTH = 540;
    if (data.length !== 540) {
      throw new Error(`invalid data length ${data.length}; must be ${this.TOTAL_LENGTH}`);
    }
    this.buffer = Buffer.from(data);
  }

  write(blockNumber, dataBuf) {
    return new Promise((resolve, reject) => {
      if (blockNumber * this.PAGE_SIZE > this.TOTAL_LENGTH) {
        return reject(new Error(`Block number ${blockNumber} out of range`));
      }
      if ((blockNumber * this.PAGE_SIZE) + dataBuf.length > this.TOTAL_LENGTH) {
        return reject(new Error(`Data will exceed writeable range`));
      }
      for (var i = 0; i < dataBuf.length; i++) {
        this.buffer.writeUInt8(dataBuf[i], (blockNumber * this.PAGE_SIZE) + i);
      }
      resolve();
    });
  }

  read(blockNumber, bytes) {
    return new Promise((resolve, reject) => {
      if (blockNumber * this.PAGE_SIZE > this.TOTAL_LENGTH) {
        return reject(new Error(`Block number ${blockNumber} out of range`));
      }
      const read = this.buffer.slice(blockNumber * this.PAGE_SIZE, (blockNumber * this.PAGE_SIZE) + bytes);
      resolve(read);
    });
  }
}

exports = module.exports = BufferTagReader;
