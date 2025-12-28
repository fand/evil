'use strict';

var express = require('express'),
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Setup Express
var app = express();
require('./server/config/express')(app);
require('./server/router')(app);

// Start server
app.listen(config.port, config.ip, function () {
  console.log(
    'Express server listening on %s:%d, in %s mode',
    config.ip,
    config.port,
    app.get('env')
  );
});

// Expose app
exports = module.exports = app;
