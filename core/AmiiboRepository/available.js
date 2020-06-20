'use strict';
const env = require('../../env'),
  fs = require('fs'),
  imageUrl = require('./imageUrl');

exports = module.exports = () => new Promise((resolve, reject) => {
  fs.readdir(env.amiiboDirectory(), (err, files) => err ? reject(err) : resolve(files));
})
.then(files => new Promise((resolve, reject) => {
  const available = [];
  (function next(i) {
    if (i < files.length) {
      const filepath = path.join(env.amiiboDirectory(), files[i]);
      imageUrl(filepath)
        .then(url => {
          available.push({file: files[i], imageUrl: url});
          setImmediate(next, i + 1);
        })
        .catch(reject);
    } else {
      resolve(available);
    }
  }(0));
}));
