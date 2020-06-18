'use strict';

const { colorReset } = require('debug-logger');

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
    this.purpose = 'read';
    this.reader = null;
    this.nfc = new NFC();
    this.timeouts = {write: null};
    this.nfc.on('reader', reader => this.setReader(reader));
  }

  clearTimeouts() {
    _.forEach(this.timeouts, (timeout, key) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      this.timeouts[key] = null;
    });
  }

  setReader(reader) {
    this.reader = reader;
    this.reader
      .on('error', this.onReaderError)
      .on('end', this.onReaderEnd)
      .on('card', this.onCardPresented)
      .on('card.off', this.onCardRemoved);
    this.emit('reader', {connected: true});
  }

  onReaderEnd() {
    this.reader = null;
    this.card = null;
    this.amiibo = null;
    this.clearTimeouts();
    this.emit('reader', {connected: false});
  }

  onReaderError(err) {
    log.error(err);
  }

  async onCardPresented(card) {
    this.card = card;
    const purpose = await this.getPurpose();
    if (purpose === 'read') {
      await this.readAmiibo();
    }
    if (purpose === 'write') {
      await this.writeAmiibo();
    }
  }

  onCardRemoved() {
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
    return await 
    Promise.reject(new Error(`invalid purpose: '${newPurpose}'`));
  }

  async getPurpose() {
    return await Promise.resolve(this.purpose);
  }

  async readAmiibo() {
    this.amiibo = new Amiibo(this.reader);
    const amiiboId = await this.amiibo.id();
    const amiiboCharacter = await AmiiboDatabase.lookupById(amiiboId);
    this.emit('amiibo', amiiboId, amiiboCharacter.name, this.amiibo);
  }

  async doWriteAmiibo() {
    this.amiibo = new Amiibo(this.reader);
    this.amiibo.onWriteProgress(message => this.emit('write-progress', message));
    await this.amiibo.write(amiiboWriteData);
  }

  writeAmiibo() {
    return new Promise((resolve, reject) => {
      this.emit('write-progress', 'waiting');
      this.timeouts.write = setTimeout(() => {
        this.doWriteAmiibo()
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
