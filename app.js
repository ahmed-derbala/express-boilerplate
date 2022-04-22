var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const useragent = require('express-useragent');
const expressWinston = require('express-winston');
require('winston-mongodb');
const winston = require('winston'); //logging module

const loaders =require('./helpers/loaders')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(useragent.express());

//app.use(logger('dev'));
app.use(expressWinston.logger({
  transports: [
    new winston.transports.MongoDB({
      db:prefs.db_uri,
      options:{
        useUnifiedTopology:true
      },
      decolorize:true,
    })
  ],
  expressFormat: true
}));

logger.token('userIp',(req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);
logger.token('userId', (req) => {
  if (req.user) {
    return req.user._id;
  }
   return '-';
});

logger.token('userEmail', (req) => {
  if (req.user) {
    return req.user.email;
  }
   return '-';
});

logger.token('browser', (req) => {
  return req.useragent.browser;
});

logger.token('os', (req) => {
  return req.useragent.os;
});

logger.token('platform', (req) => {
  return req.useragent.platform;
});

logger.token('isBot', (req) => {
  return req.useragent.isBot;
});

logger.token('referrer', (req) => {
  return req.headers.referrer || req.headers.referer;
});

logger.token('body', (req) => {
  if (req.body.password) {
    req.body.password = '*****';
  }
  return JSON.stringify(req.body);
});
//new line
logger.token('nl', (req) => {
  return '\n';
});

logger.token('origin', (req) => {
  return req.headers.origin;
});
app.use(logger(
    `:status :method :url :nl *userIp=:userIp userId=:userId userEmail=:userEmail :nl *body=:body :nl *browser=:browser os=:os platform=:platform :nl *origin=:origin isBot=:isBot referrer=:referrer :nl responseTime=[*:response-time*]`,
    { stream: log.stream },
  ),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 loaders.routes(app)//load routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
