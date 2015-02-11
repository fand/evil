'use strict';

var Clip = require('../models/Clip');
var TrackStore; // circular dependecy

var data = {
  clips       : [],
  currentClip : 0
};

var ClipStore = {
  initClips: function (clips) {
    data.clips = clips.map(t => new Clip(t));
  },
  getCurrentClip: function () {
    TrackStore = TrackStore || require('./TrackStore.js');
    var track = TrackStore.getCurrentTrack();
    if (track)  {
      return track.clips[data.currentClip];
    }
    return null;
  },
  getClips: function () {
    TrackStore = TrackStore || require('./TrackStore.js');
    return TrackStore.getTracks().reduce((a, t) => { return a.concat(t); }, []);
  },
  addClips: function (clips) {
    var newClips = clips.map(c => new Clip(c));
    data.clips = data.clips.concat(newClips);
    return newClips;
  }
};

module.exports = ClipStore;
