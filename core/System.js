'use strict';
const _ = require('lodash'),
  env = require('../env'),
  {NFC} = require('nfc-pcsc'),
  EventEmitter = require('events'),
  BufferTagReader = require('./BufferTagReader'),
  Amiibo = require('./Amiibo'),
  AmiiboDatabase = require('./AmiiboDatabase'),
  AmiiboRepository = require('./AmiiboRepository'),
  log = require('debug-logger')('System');

const availablePurposes = ['read', 'write'];

class System extends EventEmitter {
  constructor() {
    super();
    this.writeConfiguration = {
      data: Buffer.allocUnsafe(0),
    };
    this.timeouts = {write: null};
    this.purpose = 'read';
    this.readers = {};
    this.cards = {};
    this.amiibo = null;
    this.nfc = new NFC();
    this.nfc.on('reader', reader => this.onReader(reader));
  }

  readerIsConnected() {
    return _.size(this.readers) > 0;
  }

  cardIsPresent() {
    return _.size(this.cards) > 0;
  }

  async state() {
    let amiiboImageUrl = null,
      amiiboCharacterName = null,
      blank = true;
    const reader = _.get(this.readers, _.first(_.keys(this.cards)));
    if (this.amiibo) {
      amiiboImageUrl = await this.amiibo.imageUrl();
      const amiiboId = await this.amiibo.id();
      const amiiboCharacter = await AmiiboDatabase.lookupById(amiiboId);
      amiiboCharacterName = _.get(amiiboCharacter, 'name', null);
    }
    if (reader) {
      const amiibo = new Amiibo(reader);
      try {
        await amiibo.validateBlankTag();
      } catch (e) {
        blank = false;
      }
    }
    return {
      amiibo: {
        imageUrl: amiiboImageUrl,
        character: {name: amiiboCharacterName},
      },
      reader: {connected: this.readerIsConnected()},
      card: {
        blank,
        present: this.cardIsPresent(),
      },
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
    this.cards = {};
    this.amiibo = null;
    this.clearTimeouts();
    this.emit('reader', {connected: false});
  }

  onReaderError(readerName, err) {
    log.error(`${readerName} error`, err);
  }

  async onCardPresented(readerName, card) {
    this.cards[readerName] = card;
    const purpose = await this.getPurpose();
    if (purpose === 'read') {
      await this.readAmiibo(this.readers[readerName]);
    }
    if (purpose === 'write') {
      await this.verifyBlankTag(this.readers[readerName]);
    }
  }

  async verifyBlankTag(reader) {
    const amiibo = new Amiibo(reader);
    try {
      await amiibo.validateBlankTag();
      this.emit('card', {present: true, blank: true});
    } catch (e) {
      this.emit('card', {present: true, blank: false});
    }
  }

  onCardRemoved(readerName) {
    delete this.cards[readerName];
    this.amiibo = null;
    this.clearTimeouts();
    this.emit('amiibo.removed');
  }

  async setPurpose(newPurpose) {
    if (_.includes(availablePurposes, newPurpose)) {
      this.purpose = newPurpose;
      if (newPurpose === 'read' && _.size(this.cards) === 0) {
        // there isn't actually a card present, so set amiibo back to null
        this.amiibo = null;
      }
      this.emit('purpose', newPurpose);
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
      this.emit('amiibo', amiiboId, _.get(amiiboCharacter, 'name', null), this.amiibo);  
    } catch (err) {
      this.amiibo = null;
      this.emit('error', err);
    }
  }

  async doWriteAmiibo(reader, amiiboData) {
    this.amiibo = new Amiibo(reader);
    this.amiibo.onWriteProgress(message => this.emit('write-progress', message));
    if (_.size(amiiboData) !== 540) {
      this.emit('write-progress', `invalid amiibo size ${_.size(amiiboData)}; should be 540`);
      return;
    }
    try {
      await this.amiibo.write(amiiboData);
    } catch (err) {
      this.amiibo = null;
      this.emit('write-progress', `error: ${err.message}`);
      throw err;
    }
  }

  findPopulatedReader() {
    return _.size(this.cards) === 0
      ? null
      : _.get(this.readers, _.first(_.keys(this.cards)));
  }

  async writeAmiibo(amiiboData) {
    if (!this.readerIsConnected()) {
      throw new Error('no reader connected');
    }
    if (!this.cardIsPresent()) {
      throw new Error('no tag present');
    }
    const reader = this.findPopulatedReader();
    await this.doWriteAmiibo(reader, amiiboData)
  }

  async setAmiibo(amiiboFilename) {
    this.writeConfiguration.data = await AmiiboRepository.read(amiiboFilename);
    const amiiboTagBufferReader = new BufferTagReader(this.writeConfiguration.data);
    this.amiibo = new Amiibo(amiiboTagBufferReader);
    const amiiboId = await this.amiibo.id();
    const amiiboCharacter = await AmiiboDatabase.lookupById(amiiboId);
    this.emit('amiibo', amiiboId, _.get(amiiboCharacter, 'name', '(character not found in database)'), this.amiibo);
  }

}

exports = module.exports = new System();
