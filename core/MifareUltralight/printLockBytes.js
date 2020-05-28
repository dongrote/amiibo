'use strict';

exports = module.exports = payload => {
  const lockBytes = payload.slice(10, 12);
  if (lockBytes.length !== 2) return;
  const [lockByte0, lockByte1] = lockBytes;
  console.log(`page   4: ${lockByte0 & (1 << 4) ? ' L' : 'UL'}`);
  console.log(`page   5: ${lockByte0 & (1 << 5) ? ' L' : 'UL'}`);
  console.log(`page   6: ${lockByte0 & (1 << 6) ? ' L' : 'UL'}`);
  console.log(`page   7: ${lockByte0 & (1 << 7) ? ' L' : 'UL'}`);
  console.log(`page   8: ${lockByte1 & (1 << 0) ? ' L' : 'UL'}`);
  console.log(`page   9: ${lockByte0 & (1 << 1) ? ' L' : 'UL'}`);
  console.log(`page  10: ${lockByte0 & (1 << 2) ? ' L' : 'UL'}`);
  console.log(`page  11: ${lockByte0 & (1 << 3) ? ' L' : 'UL'}`);
  console.log(`page  12: ${lockByte0 & (1 << 4) ? ' L' : 'UL'}`);
  console.log(`page  13: ${lockByte0 & (1 << 5) ? ' L' : 'UL'}`);
  console.log(`page  14: ${lockByte0 & (1 << 6) ? ' L' : 'UL'}`);
  console.log(`page  15: ${lockByte0 & (1 << 7) ? ' L' : 'UL'}`);
  console.log(`     OTP: ${lockByte0 & (1 << 3) ? ' L' : 'UL'}`);
  console.log(`BL 15-10: ${lockByte0 & (1 << 2) ? ' L' : 'UL'}`);
  console.log(`BL   9-4: ${lockByte0 & (1 << 1) ? ' L' : 'UL'}`);
  console.log(`BL   OTP: ${lockByte0 & (1 << 0) ? ' L' : 'UL'}`);
};
