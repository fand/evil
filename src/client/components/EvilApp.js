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

// var Sequencer = require('../services/Sequencer');
// var Player    = require('../services/Player');

/**
 * Entire app
 */
var EvilApp = React.createClass({
  getInitialState: function() {
    var song = SongStore.getSong();

    var scene = SceneStore.getCurrentScene();
    var track = TrackStore.getCurrentTrack();
    var clip  = ClipStore.getCurrentClip();

    console.log('cliiiiiiip');
    console.log(clip);
    console.log(ClipStore.getClips());

    return {
      song   : song,
      scene  : scene,
      device : DeviceStore.getCurrentDevice(),
      clip   : clip
    };
  },
  render: function() {
    return (
      <div>
        <Header />
        <SessionView song={this.state.song}/>
        <ArrangementView song={this.state.song}/>
        <ClipView clip={this.state.clip}/>
        <DeviceView device={this.state.device}/>
      </div>
    );
  }
});

module.exports = EvilApp;
