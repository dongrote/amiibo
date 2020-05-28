'use strict';
const _ = require('lodash');
const core = require('./core');


const db = new core.AmiiboDatabase();

db
  .load('./amiibo.json')
  .then(() => {
    const reader = new core.FileTagReader(),
      writer = new core.FileTagReader();
    return reader
      .import(process.argv[2])
      .then(() => {
        const amiibo = new core.Amiibo(reader);
        return amiibo.id()
          .then(id => db.lookupAmiiboById(id))
          .then(a => console.log(`amiibo: ${_.get(a, 'name', 'unknown')}`))
          .then(() => {
            const amiiboExport = new core.Amiibo(writer);
            return amiiboExport.write(reader.buffer)
              .then(() => amiiboExport.export(process.argv[3]))
              .then(() => console.log('exported new amiibo to ', process.argv[3]));
          });
      });
  })
  .catch(console.error);

