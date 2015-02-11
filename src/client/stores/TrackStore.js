'use strict';

var Track = require('../models/Track');

var data = {
  tracks: [],
  currentTrack: 0
};

var TrackStore = {
  initTracks: function (tracks) {
    data.tracks = tracks.map(t => new Track(t));
  },
  getTracks: function () {
    return data.tracks;
  },
  getCurrentTrack: function () {
    console.log(data.tracks);
    return data.tracks[data.currentTrack];
  },
  addTracks: function (tracks) {
    var newTracks = tracks.map(t => new Track(t));
    data.tracks = data.tracks.concat(newTracks);
    return newTracks;
  }
};

module.exports = TrackStore;
