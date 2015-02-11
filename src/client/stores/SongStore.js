'use strict';

var Song = require('../models/Song');

const defaultSong = new Song({
  title: 'default song',
  tracks: [{
    name: 'Bass',
    device: {
      name: 'Buzzsaw',
    },
    clips: [{
      name: 'Intro',
      length: 4
    }]
  }]
});

var data = {
  currentSong: 0,
  songs: []
};

var SongStore = {
  getSong: function () {
    if (data.songs.length === 0) {
      data.songs.push(defaultSong);
    }
    return data.songs[data.currentSong];
  }
};

module.exports = SongStore;
