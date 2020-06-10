'use strict';
const EventEmitter = require('events'),
  fs = require('fs');

class AmiiboBinFile extends EventEmitter {
  constructor(binFilePath) {
    super();
    this.path = binFilePath;
    setImmediate(() => this.loadBinFile());
  }

  loadBinFile() {
    const filepath = this.path;
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, data) => {
        if (err) {
          this.emit('error', err);
          return reject(err);
        }
        this.data = data;
        resolve();
        this.emit('open', this);
      });
    });
  }
}

exports = module.exports = AmiiboBinFile;
