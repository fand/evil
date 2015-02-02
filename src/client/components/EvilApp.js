/** @jsx React.DOM */
'use strict';

var React = require('react');

// Components
var Header = require('./Header');
var SessionView = require('./SessionView');
var ArrangementView = require('./ArrangementView');
var ClipView = require('./ClipView');
var DeviceView = require('./DeviceView');

// Models, Stores
var Song = require('../models/Song');
var SongStore = require('../stores/SongStore');
var Clip = require('../models/Clip');
var SongStore = require('../stores/SongStore');
var Device = require('../models/Device');
var DeviceStore = require('../stores/DeviceStore');


/**
 * Entire app
 */
var EvilApp = React.createClass({
  getInitialState: function() {
    return {
      song: SongStore.getSong()
      //device: DeviceStore.getDevice(),
      //clip: ClipStore.getClip()
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
