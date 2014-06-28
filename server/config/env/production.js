'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT ||
        9000,
  mongo: {
    uri: 'mongodb://localhost/evil'
  }
};
