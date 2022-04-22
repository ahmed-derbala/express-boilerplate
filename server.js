#!/usr/bin/env node
global.appRootPath = require('app-root-path'); // the root path of the project
global.errorHandler = require(`${appRootPath}/utils/error`).errorHandler; //loading general error handling module

const packagejson = require(`${appRootPath}/package.json`);
const ip = require("ip");
const tColors = require('colors'); // color module to have colorful terminal, doesnt need to be loaded global

/**
 * check prefs file
 */
const fs = require('fs');
if (!fs.existsSync(`${appRootPath}/prefs.js`)) throw new Error(`/prefs.js is needed to run the project.`.black.bgRed);
global.prefs = require(`${appRootPath}/prefs.js`);

global.log = require(`${appRootPath}/utils/log`).log; //loading log module

/**
 * connect to db
 */
require(`${appRootPath}/utils/db`);
/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('olympiagym-nodejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(prefs.backend.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
if (prefs.cluster > 0) {
  let cluster = require('cluster');
  if (cluster.isMaster) {
    console.log(`cluster is enabled. ${prefs.cluster} cpus are in use`.black.bgBlue)
    // Create a worker for each CPU
    for (let c = 1; c <= prefs.cluster; c++) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function () {
      console.log(`cluster exited`)
      cluster.fork();
    });

  } else {
    //launching the server
    server.listen(port, console.log(`******** ${packagejson.name} ${packagejson.version} http://${ip.address()}:${port}/ NODE_ENV=${prefs.NODE_ENV} fork ${cluster.worker.id} pid ${cluster.worker.process.pid} ********`.black.bgBlue));
    server.on('error', onError);
    server.on('listening', onListening);
  }
} else {
  //launching the server without cluster
  server.listen(port, console.log(`******** ${packagejson.name} ${packagejson.version} http://${ip.address()}:${port}/ NODE_ENV=${prefs.NODE_ENV} ********`.black.bgBlue));
  server.on('error', onError);
  server.on('listening', onListening);
}
server.setTimeout(0)//make sure timeout is disabled , wait forever

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
