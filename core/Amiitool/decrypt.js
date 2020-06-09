'use strict';
const env = require('../../env'),
  cp = require('child_process');

exports = module.exports = encryptedAmiiboData => new Promise((resolve, reject) => {
  let plaintext = Buffer.allocUnsafe(0);
  const args = [
    '-d',
    '-k',
    env.amiitoolKeySetFilePath(),
  ];
  const child = cp.spawn('amiitool', args, {stdio: 'pipe'})
    .on('error', reject);
  child.stderr.on('data', chunk => console.log(chunk.toString()));
  child.stdout
    .on('data', chunk => {
      plaintext = Buffer.concat([plaintext, chunk]);
    })
    .on('end', () => resolve(plaintext));
  child.stdin.end(encryptedAmiiboData);
});
