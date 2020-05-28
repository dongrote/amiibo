'use strict';
/**
 * A file-based pseudo tag reader/writer
 */
const EventEmitter = require('events'),
  fs = require('fs');

class FileTagReader extends EventEmitter {
  TOTAL_LENGTH = 540;
  PAGE_SIZE = 4;
  buffer = Buffer.alloc(540);

  import(filepath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, data) => {
        if (err) {
          return reject(err);
        }
        if (data.length < this.TOTAL_LENGTH) {
          return reject(new Error(`tag file '${filepath}' too small. read ${data.length} bytes but need ${this.TOTAL_LENGTH}`))
        }
        this.buffer = data.slice(0, this.TOTAL_LENGTH);
        resolve();
      });
    });
  }

  export(filepath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, this.buffer, err => err ? reject(err) : resolve());
    });
  }

  write(blockNumber, dataBuf) {
    return new Promise((resolve, reject) => {
      if (blockNumber * this.PAGE_SIZE > this.TOTAL_LENGTH) {
        return reject(new Error(`Block number ${blockNumber} out of range`));
      }
      if ((blockNumber * this.PAGE_SIZE) + dataBuf.length > this.TOTAL_LENGTH) {
        return reject(new Error(`Data will exceed writeable range`));
      }
      console.dir(dataBuf);
      console.dir(blockNumber * this.PAGE_SIZE);
      this.buffer.write(dataBuf.toString('latin1'), blockNumber * this.PAGE_SIZE);
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

exports = module.exports = FileTagReader;
