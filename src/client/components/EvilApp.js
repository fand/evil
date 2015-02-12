/** @jsx React.DOM */
'use strict';

var React = require('react');

// Components
var Header          = require('./Header');
var SessionView     = require('./SessionView');
var ArrangementView = require('./ArrangementView');
var ClipView        = require('./ClipView');
var DeviceView      = require('./DeviceView');

// Stores
var SongStore   = require('../stores/SongStore');
var SceneStore  = require('../stores/SceneStore');
var ClipStore   = require('../stores/ClipStore');
var DeviceStore = require('../stores/DeviceStore');
var TrackStore  = require('../stores/TrackStore');
var ViewAction  = require('../actions/ViewAction');

// var Sequencer = require('../services/Sequencer');
// var Player    = require('../services/Player');

/**
 * Entire app
 */
var EvilApp = React.createClass({
  componentDidMount: function () {
    ViewAction.on('SELECT_TRACK', this.selectTrack);
    ViewAction.on('SELECT_CLIP', this.selectClip);
    ViewAction.on('SELECT_SCENE', this.selectScene);
  },
  getInitialState: function() {
    var song = SongStore.getSong();

    return {
      song         : song,
      currentTrack : 0,
      currentScene : 0,
      currentClip  : 0
    };
  },
  render: function() {
    var track = TrackStore.getTrack(this.state.currentTrack);
    if (track) {
      var clip = track.clips[this.state.currentClip];
      var device = track.device;
    }
    return (
      <div>
        <Header />
        <SessionView song={this.state.song} />
        <ArrangementView song={this.state.song} />
        <ClipView clip={clip}/>
        <DeviceView device={device}/>
      </div>
    );
  },
  selectTrack: function (index) {
    this.setState({currentTrack: index});
  },
  selectClip: function (index) {
    this.setState({currentClip: index});
  },
  selectScene: function (index) {
    this.setState({currentScene: index});
  }
});

module.exports = EvilApp;
