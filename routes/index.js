'use strict';
exports = module.exports = require('express').Router();
const systemState = require('./systemState'),
  amiibos = require('./amiibos'),
  setAmiibo = require('./setAmiibo'),
  setPurpose = require('./setPurpose');

exports.get('/health', (req, res) => res.sendStatus(200));
exports.get('/amiibos', amiibos);
exports.get('/system/state', systemState);
exports.post('/system/purpose', setPurpose);
exports.get('/system/configure', setAmiibo);
