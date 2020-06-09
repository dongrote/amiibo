'use strict';
const env = require('../../env'),
  cp = require('child_process');

exports = module.exports = plaintextAmiiboData => new Promise((resolve, reject) => {
  let encrypted = Buffer.allocUnsafe(0);
  const args = [
    '-e',
    '-k',
    env.amiitoolKeySetFilePath(),
  ];
  const child = cp.spawn('amiitool', args, {stdio: 'pipe'})
    .on('error', reject);
  child.stderr.on('data', chunk => console.log(chunk.toString()));
  child.stdout
    .on('data', chunk => {
      encrypted = Buffer.concat(encrypted, chunk);
    })
    .on('end', () => resolve(encrypted));
  child.stdin.write(plaintextAmiiboData);
  child.stdin.end();
});
