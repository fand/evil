/** @jsx React.DOM */
'use strict';

var Song = require('../models/Song');

var SongStore = {
  currentSong: new Song(),
  getSong: function () {
    return this.currentSong;
  }
};

module.exports = SongStore;
