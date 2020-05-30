'use strict';
exports = module.exports = require('express').Router();

router.get('/health', (req, res) => res.sendStatus(200));
