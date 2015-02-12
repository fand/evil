'use strict';

var EventEmitter = require('eventemitter3').EventEmitter;
var Dispatcher = require('../Dispatcher');

var Track = require('../models/Track');

var data = {
  tracks: []
};

class TrackStore extends EventEmitter {
  initTracks (tracks) {
    data.tracks = tracks.map(t => new Track(t));
  }
  getTracks () {
    return data.tracks;
  }
  getTrack (idx) {
    return data.tracks[idx];
  }
  getCurrentTrack () {
    return data.tracks[data.currentTrack];
  }
  addTracks (tracks) {
    var newTracks = tracks.map(t => new Track(t));
    data.tracks = data.tracks.concat(newTracks);
    return newTracks;
  }
}

module.exports = new TrackStore();
