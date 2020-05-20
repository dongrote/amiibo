'use strict';

class Amiibo {
  AMIIBO_ID_OFFSET = 0x54;
  AMIIBO_ID_LENGTH = 0x8;
  constructor(payload) {
    this.payload = payload;
  }

  uid() {
    return Buffer.concat([
      this.payload.slice(0, 3),
      this.payload.slice(4, 8),
    ]);
  }

  amiiboId() {
   return this.payload.slice(this.AMIIBO_ID_OFFSET, this.AMIIBO_ID_OFFSET + this.AMIIBO_ID_LENGTH);
  }
}

exports = module.exports = Amiibo;
