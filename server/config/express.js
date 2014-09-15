'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(session),
    middleware = require('../middleware');

var secret = require('../../secret.js');

var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: config.root + '/client/views', ext : '.ect' });


/**
 * Express configuration
 */
module.exports = function(app) {
  var env = app.get('env');

  if ('development' === env) {
    // app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if ('production' === env) {
    app.use(compression());
    app.use(favicon(path.join(config.root, 'static', 'favicon.ico')));
  }

  app.use('/js', express.static(path.join(config.root, 'client')));
  app.use('/static', express.static(path.join(config.root, 'static')));
  // app.engine('html', require('ejs').renderFile);
  // app.set('view engine', 'html');
  app.engine('ect', ectRenderer.render);
  app.set('view engine', 'ect');
  app.set('views', config.root + '/client/views');
  app.use(logger('dev'));

  app.use(bodyParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.use(methodOverride());
  app.use(cookieParser());

  app.use(middleware.redirector);

  // Persist sessions with mongoStore
  app.use(session({
    secret: secret.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      url: config.mongo.uri,
      collection: 'sessions'
    }, function () {
      console.log('db connection open');
    })
  }));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Error handler - has to be last
  if ('development' === app.get('env')) {
    app.use(errorHandler());
  }
};
