/** @jsx React.DOM */
'use strict';

var React = require('react');

// Components
var Header     = require('./Header');
var Footer     = require('./Footer');
var TopView    = require('./TopView');
var BottomView = require('./BottomView');

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
    ViewAction.on('SELECT_SCENE', this.selectScene);
    ViewAction.on('SELECT_CELL', this.selectCell);
  },
  getInitialState: function() {
    var song = SongStore.getSong();

    return {
      song          : song,
      currentTrack  : 0,
      currentScene  : 0,
      currentCell   : null,
      currentCellId : null
    };
  },
  render: function() {
    var track = TrackStore.getTrack(this.state.currentTrack);  // TrackStore要らない……？？？
    if (track) {
      var clip = track.clips[this.state.currentCell];
      var device = track.device;
    }

    var selection = {
      currentTrack  : this.state.currentTrack,
      currentScene  : this.state.currentScene,
      currentCell   : this.state.currentCell,
      currentCellId : this.state.currentCellId
    };

    return (
      <div className="EvilApp">
        <Header />
        <TopView    song={this.state.song} selection={selection} />
        <BottomView song={this.state.song} selection={selection} clip={clip} device={device} />
        <Footer song={this.state.song} />
      </div>
    );
  },

  // Set states.
  selectTrack: function (index) {
    this.setState({currentTrack: index});
  },
  selectScene: function (index) {
    this.setState({currentScene: index});
  },
  selectCell: function (index, id) {
    this.setState({
      currentCell   : index,
      currentCellId : id
    });
  },
});

module.exports = EvilApp;
