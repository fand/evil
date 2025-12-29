'use strict';

/**
 * Load environment configuration
 */
module.exports = Object.assign(
  {},
  require('./env/all.js'),
  require('./env/' + process.env.NODE_ENV + '.js') || {}
);
