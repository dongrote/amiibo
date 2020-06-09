'use strict';
const env = require('../../env'),
  cp = require('child_process');

exports = module.exports = plaintextAmiiboData => new Promise((resolve, reject) => {
  let encrypted = Buffer.allocUnsafe(0);
  const args = [
    '-e',
    '-k',
    env.amiitoolKeySetFilepath(),
  ];
  const child = cp.spawn('amiitool', args, {stdio: ['pipe', 'pipe', 'ignore']})
    .on('error', reject);
  child.stdout
    .on('data', chunk => {
      encrypted = Buffer.concat(encrypted, chunk);
    })
    .on('end', () => resolve(encrypted));
  child.stdin.write(plaintextAmiiboData);
  child.stdin.end();
});
