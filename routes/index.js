'use strict';
exports = module.exports = require('express').Router();
const multer = require('multer'),
  systemState = require('./systemState'),
  amiibos = require('./amiibos'),
  setAmiibo = require('./setAmiibo'),
  importAmiibo = require('./importAmiibo'),
  writeAmiibo = require('./writeAmiibo'),
  cardState = require('./cardState'),
  setPurpose = require('./setPurpose');

const amiiboUpload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 1000},
});

exports.get('/health', (req, res) => res.sendStatus(200));
exports.get('/amiibos', amiibos);
exports.post('/amiibos', amiiboUpload.single('file'), importAmiibo);
exports.post('/amiibo', writeAmiibo);
exports.get('/system/state', systemState);
exports.post('/system/purpose', setPurpose);
exports.get('/system/configure', setAmiibo);
