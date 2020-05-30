'use strict';
exports = module.exports = require('express').Router();
const systemState = require('./systemState');

exports.get('/health', (req, res) => res.sendStatus(200));
exports.get('/system/state', systemState);
