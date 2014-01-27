// Generated by CoffeeScript 1.6.3
(function() {
  var Player, assert, p;

  this.CONTEXT = new webkitAudioContext();

  Player = require('../static/coffee/Player');

  p = new Player();

  assert = require("assert");

  describe('Player', function() {
    return describe('#constructor()', function() {
      return it('has bpm 120', function() {
        return assert.equal(p.bpm, 120);
      });
    });
  });

}).call(this);