'use strict';
/**
 * A file-based pseudo tag reader/writer
 */
const BufferTagReader = require('./BufferTagReader');

class FileTagReader extends BufferTagReader {
  constructor() {
    super(Buffer.allocUnsafe(540));
  }

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
}

exports = module.exports = FileTagReader;
