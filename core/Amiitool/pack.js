'use strict';
const cp = require('child_process');

exports = module.exports = (key, data) => new Promise((resolve, reject) => {
  const options = {stdio: ['pipe', 'pipe', 'ignore']},
    args = ['-e', '-k', keyFile];
  const child = cp.spawn('amiitool', args, options);
  child
    .on('error', reject)
    .on('exit', () => resolve());
  child.stdin.write(data);
});
