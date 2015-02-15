'use strict';

var mirror = (array) => {
  var obj = {};
  array.forEach(e => obj[e] = e);
  return obj;
};

module.exports = {
  PayloadSources: mirror([
    'SERVER_ACTION',
    'VIEW_ACTION'
    ])
};
