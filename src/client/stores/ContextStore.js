'use strict';

var ctx = new AudioContext();

module.exports = {
  ctx: ctx,
  getContext: () => ctx
};
