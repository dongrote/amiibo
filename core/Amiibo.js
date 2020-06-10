'use strict';
const amiitool = require('./Amiitool'),
  NTAG215 = require('./NTAG215');

class Amiibo extends NTAG215 {
  HEAD_BLOCK_NUMBER = 0x15;
  HEAD_LENGTH = 0x4;
  TAIL_BLOCK_NUMBER = 0x16;
  TAIL_LENGTH = 0x4;
  AMIIBO_ID_BLOCK_NUMBER = 0x15;
  AMIIBO_ID_LENGTH = 0x8;
  AMIIBO_SIZE = 540;

  async password() {
    const uid = await this.serialNumber();
    const key = uid.length === 7 ? Buffer.allocUnsafe(4) : null;
    if (uid.length === 7) {
      key.writeUInt8((0xff & (0xaa ^ (uid[1] ^ uid[3]))), 0);
      key.writeUInt8((0xff & (0x55 ^ (uid[2] ^ uid[4]))), 1);
      key.writeUInt8((0xff & (0xaa ^ (uid[3] ^ uid[5]))), 2);
      key.writeUInt8((0xff & (0x55 ^ (uid[4] ^ uid[6]))), 3);
    }
    return key;
  }

  async id() {
    const rx = await this.reader.read(this.AMIIBO_ID_BLOCK_NUMBER, this.AMIIBO_ID_LENGTH);
    return rx.toString('hex');
  }

  async head() {
    const rx = await this.reader.read(this.HEAD_BLOCK_NUMBER, this.HEAD_LENGTH);
    return rx.readInt32BE();
  }

  async tail() {
    const rx = await this.reader.read(this.TAIL_BLOCK_NUMBER, this.TAIL_LENGTH);
    return rx.readInt32BE();
  }

  async imageUrl() {
    const head = await this.head();
    const tail = await this.tail();
    return `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_${head.toString(16).padStart(8, '0')}-${tail.toString(16).padStart(8, '0')}.png`;
  }

  async validateBlankTag() {
    console.log('validating tag is blank');
    const lockBytes = await this.lockBytes();
    if (lockBytes[0] === 0x0f && lockBytes[1] === 0xe0) {
      throw new Error('tag is already an Amiibo');
    }
    console.log('tag is blank');
  }

  async writeUserMemory(amiiboData) {
    const sliceStart = this.CC_PAGENO * this.PAGE_SIZE;
    const sliceEnd = this.DLOCKBYTES_PAGENO * this.PAGE_SIZE;
    if (amiiboData.length !== this.AMIIBO_SIZE) {
      throw new Error(`Expected Amiibo Data to be ${this.AMIIBO_SIZE} bytes; got ${amiiboData.length} bytes`);
    }
    return await this.reader
      .write(this.CC_PAGENO, amiiboData.slice(sliceStart, sliceEnd));
  }

  async writeLockInfo() {
    const pageTwo = await this.reader.read(this.LOCKBYTES_PAGENO, this.PAGE_SIZE);
    pageTwo[2] = 0x0f;
    pageTwo[3] = 0xe0;
    await this.reader.write(this.LOCKBYTES_PAGENO, pageTwo);
    await this.reader.write(this.DLOCKBYTES_PAGENO, Buffer.from([0x01, 0x00, 0x0f, 0x00]));
    await this.reader.write(this.CFG0_PAGENO, Buffer.from([0x00, 0x00, 0x00, 0x04]));
    await this.reader.write(this.CFG1_PAGENO, Buffer.from([0x5f, 0x00, 0x00, 0x00]));
  }

  async patchUID(amiiboData) {
    const firstNine = await this.reader.read(0, 9);
    const plaintext = await amiitool.decrypt(amiiboData);
    console.log(`patching amiibo with uid (${firstNine.slice(0, 8).toString('hex')})`);
    for(var i = 0; i < firstNine.length - 1; i++) {
      plaintext.writeUInt8(firstNine[i], 0x1d4 + i);
    }
    /*
     really not sure why they write the ninth byte to offset zero before the encrypt,
     since that byte location is not writable on the NTAG215, but they do it in the TagMo
     code; I could see it maybe having some sort of affect on blockchain crypto
    */
   plaintext[0] = firstNine[8];
   return await amiitool.encrypt(plaintext);
  }

  async write(amiiboData) {
    console.log('validating tag is blank');
    await this.validateBlankTag();
    console.log('tag is blank');
    const patchedAmiiboData = await this.patchUID(amiiboData);
    await this.writeUserMemory(patchedAmiiboData);
    console.log('wrote user memory');
    const password = await this.password();
    await this.writePACK(Buffer.from([0x80, 0x80]));
    console.log('wrote PACK');
    await this.writePassword(password);
    console.log('wrote password');
    await this.writeLockInfo();
    console.log('wrote lock info');
  }

}

exports = module.exports = Amiibo;
