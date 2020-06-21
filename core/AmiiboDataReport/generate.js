'use strict';
const id = require('./id'),
  imageUrl = require('./imageUrl'),
  name = require('./name'),
  size = require('./size'),
  blank = require('./blank');

exports = module.exports = amiiboData => Promise
  .all([id, imageUrl, name, size, blank].map(report => report(amiiboData)))
  .then(([idReport, imageUrlReport, nameReport, sizeReport, blankReport]) => ({
    id: idReport,
    size: sizeReport,
    imageUrl: imageUrlReport,
    name: nameReport,
    blank: blankReport,
  }));
