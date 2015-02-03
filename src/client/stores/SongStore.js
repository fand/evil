/** @jsx React.DOM */
'use strict';

var Song = require('../models/Song');

var defaultSong = new Song({
  title: 'default song'
});


var SongStore = {
  currentSong: defaultSong,
  getSong: function () {
    return this.currentSong;
  }
};

module.exports = SongStore;
