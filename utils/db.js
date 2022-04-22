const mongoose = require('mongoose');
const loaders =require('../helpers/loaders')



mongoose.connect(prefs.db_uri);
const db = mongoose.connection;

db.on('error', function () {
  console.error(`db_conn_error | ${prefs.db.name} | ${prefs.db.host}:${prefs.db.port}`.black.bgRed);
});

db.once('open', function () {
  console.log(`db_conn_success | ${prefs.db.name} | ${prefs.db.host}:${prefs.db.port}`.black.bgGreen);
});

 loaders.models()

