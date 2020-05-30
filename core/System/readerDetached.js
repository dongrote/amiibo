'use strict';
const Websockets = require('../Websockets');

exports = module.exports = () => {
  Websockets.publish('reader', {connected: false});
};

