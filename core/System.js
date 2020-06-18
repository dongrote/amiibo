'use strict';
const _ = require('lodash'),
  env = require('../env'),
  {NFC} = require('nfc-pcsc'),
  EventEmitter = require('events'),
  Amiibo = require('./Amiibo'),
  AmiiboDatabase = require('./AmiiboDatabase'),
  log = require('debug-logger')('System');
const availablePurposes = ['read', 'write'];

class System extends EventEmitter {
  constructor() {
    super();
    this.writeConfiguration = {};
    this.timeouts = {write: null};
    this.purpose = 'read';
    this.readers = {};
    this.card = null;
    this.amiibo = null;
    this.nfc = new NFC();
    this.nfc.on('reader', reader => this.onReader(reader));
  }

  async state() {
    let amiiboImageUrl = null,
      amiiboCharacterName = null;
    if (this.amiibo) {
      amiiboImageUrl = await this.amiibo.imageUrl();
      const amiiboId = await this.amiibo.id();
      const amiiboCharacter = await AmiiboDatabase.lookupById(amiiboId);
      amiiboCharacterName = amiiboCharacter.name;
    }
    return {
      amiibo: {
        imageUrl: amiiboImageUrl,
        character: {name: amiiboCharacterName},
      },
      reader: {connected: _.size(this.readers) > 0},
      card: {present: this.card !== null},
      purpose: this.purpose,
    };
  }

  clearTimeouts() {
    _.forEach(this.timeouts, (timeout, key) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      this.timeouts[key] = null;
    });
  }

  onReader(reader) {
    this.readers[reader.name] = reader;
    reader
      .on('error', err => this.onReaderError(reader.name, err))
      .on('end', () => this.onReaderEnd(reader.name))
      .on('card', card => this.onCardPresented(reader.name, card))
      .on('card.off', () => this.onCardRemoved(reader.name));
    this.emit('reader', {connected: true});
  }

  onReaderEnd(readerName) {
    delete this.readers[readerName];
    this.card = null;
    this.amiibo = null;
    this.clearTimeouts();
    this.emit('reader', {connected: false});
  }

  onReaderError(readerName, err) {
    log.error(`${readerName} error`, err);
  }

  async onCardPresented(readerName, card) {
    this.card = card;
    const purpose = await this.getPurpose();
    if (purpose === 'read') {
      await this.readAmiibo(this.readers[readerName]);
    }
    if (purpose === 'write') {
      await this.writeAmiibo(this.readers[readerName]);
    }
  }

  onCardRemoved(readerName) {
    this.card = null;
    this.amiibo = null;
    this.clearTimeouts();
    this.emit('amiibo.removed');
  }

  async setPurpose(newPurpose) {
    if (_.includes(availablePurposes, newPurpose)) {
      this.purpose = newPurpose;
      return await Promise.resolve();
    }
    return await Promise.reject(new Error(`invalid purpose: '${newPurpose}'`));
  }

  async getPurpose() {
    return await Promise.resolve(this.purpose);
  }

  async readAmiibo(reader) {
    this.amiibo = new Amiibo(reader);
    try {
      const amiiboId = await this.amiibo.id();
      const amiiboCharacter = await AmiiboDatabase.lookupById(amiiboId);
      this.emit('amiibo', amiiboId, amiiboCharacter.name, this.amiibo);  
    } catch (err) {
      this.amiibo = null;
      this.emit('error', err);
    }
  }

  async doWriteAmiibo(reader) {
    this.amiibo = new Amiibo(reader);
    this.amiibo.onWriteProgress(message => this.emit('write-progress', message));
    try {
      await this.amiibo.write(amiiboWriteData);
    } catch (err) {
      this.amiibo = null;
      throw err;
    }
  }

  writeAmiibo(reader) {
    return new Promise((resolve, reject) => {
      this.emit('write-progress', 'waiting');
      this.timeouts.write = setTimeout(() => {
        this.doWriteAmiibo(reader)
          .then(() => resolve())
          .catch(reject);
      }, env.amiiboWriteGraceTimeout());
    })
    .catch(err => {
      this.emit('error', err);
      log.error(err);
    });
  }

}

exports = module.exports = new System();
