/** @jsx React.DOM */
'use strict';

var React = require('react');
var SessionView = require('./SessionView');
var ArrangementView = require('./ArrangementView');
var Header = require('./Header');
// var Song = require('../Models/Song');
// var SongStore = require('../Stores/SongStore');

/**
 * Entire app
 */
var EvilApp = React.createClass({
  getInitialState: function() {
    return {
      //song: SongStore.getSong()
      song: {
        name: 'dummysong',
        tracks: [{
          id: 0,
          name: 'track-0'
        }, {
          id: 1,
          name: 'track-1'
        }]
      }
    };
  },
  render: function() {
    return (
      <div>
        <Header />
        <SessionView song={this.state.song}/>
        <ArrangementView song={this.state.song}/>
      </div>
    );
  }
});

module.exports = EvilApp;
