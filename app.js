'use strict';
const express = require('express'),
  app = express();
exports = module.exports = app;
const _ = require('lodash'),
  HttpError = require('http-error-constructor'),
  cookieParser = require('cookie-parser'),
  core = require('./core'),
  logger = require('morgan'),
  log = require('debug-logger')('app'),
  router = require('./routes');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static('./public'));
app.use('/api', router);
app.use((req, res, next) => next(new HttpError(404)));
app.use((err, req, res, next) => {
  log.error(err);
  res.status(_.get(err, 'statusCode', 500)).json({err});
});

core.AmiiboDatabase
  .load('./amiibo.json')
  .then(() => {
    core.System
      .on('error', log.error)
      .on('reader', message => {
        log.info('reader', message);
        core.Websockets.publish('reader', message);
      })
      .on('write-progress', message => {
        log.info(`write progress: ${message}`);
        core.Websockets.publish('write-progress', message);
      })
      .on('amiibo', (amiiboId, amiiboCharacterName, amiibo) => {
        log.info('amiibo', amiiboId);
        amiibo.imageUrl()
          .then(imageUrl => {
            core.Websockets.publish('amiibo', {
              imageUrl,
              character: {name: amiiboCharacterName},
            });
          })
          .catch(log.error);
      })
      .on('amiibo.removed', () => {
        log.info('amiibo removed');
        core.Websockets.publish('amiibo', null);
      });
  })
  .catch(log.error);
