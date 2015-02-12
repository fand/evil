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
// var SceneStore  = require('../stores/SceneStore');
// var ClipStore   = require('../stores/ClipStore');
// var DeviceStore = require('../stores/DeviceStore');
var TrackStore  = require('../stores/TrackStore');
var ViewAction  = require('../actions/ViewAction');

// var Sequencer = require('../services/Sequencer');
// var Player    = require('../services/Player');

/**
 * Entire app View
 * - Init the song
 * - Manages View modes
 */
var EvilApp = React.createClass({
  componentDidMount: function () {
    ViewAction.on('SELECT_TRACK', this.selectTrack);
    ViewAction.on('SELECT_CLIP', this.selectClip);
    ViewAction.on('SELECT_SCENE', this.selectScene);

    ViewAction.on('SHOW_ARRANGEMENT', this.showArrangement);
    ViewAction.on('SHOW_SESSION', this.showSession);
    ViewAction.on('SHOW_DEVICE', this.showDevice);
    ViewAction.on('SHOW_CLIP', this.showClip);
  },
  getInitialState: function() {
    var song = SongStore.getSong();

    return {
      song         : song,
      currentTrack : 0,
      currentScene : 0,
      currentClip  : 0,

      showArrangement : false,
      showSession     : true,
      showDevice      : false,
      showClip        : false
    };
  },
  render: function() {
    var track = TrackStore.getTrack(this.state.currentTrack);
    if (track) {
      var clip = track.clips[this.state.currentClip];
      var device = track.device;
    }
    return (
      <div className="EvilApp">
        <Header />
        <div className="TopView">
          <SessionView song={this.state.song} isVisible={this.state.showSession} />
          <ArrangementView song={this.state.song} isVisible={this.state.showArrangement} />
        </div>
        <div className="BottomView">
          <ClipView clip={clip} isVisible={this.state.showClip} />
          <DeviceView device={device} isVisible={this.state.showDevice} />
        </div>
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
  },
  showSession: function () {
    this.setState({
      showSession: true,
      showArrangement: false
    });
  },
  showArrangement: function () {
    this.setState({
      showSession: false,
      showArrangement: true
    });
  },
  showDevice: function () {
    this.setState({
      showDevice: true,
      showClip: false
    });
  },
  showClip: function () {
    this.setState({
      showDevice: false,
      showClip: true
    });
  }
});

module.exports = EvilApp;
