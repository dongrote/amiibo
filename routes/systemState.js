'use strict';
const core = require('../core');

exports = module.exports = (req, res) => res.json(core.System.state);
