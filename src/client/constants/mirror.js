'use strict';

var mirror = (array) => {
  var obj = {};
  array.forEach(e => obj[e] = e);
  return obj;
};

module.exports = mirror;
