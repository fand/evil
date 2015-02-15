/** @jsx React.DOM */
'use strict';

var React = require('react');

var Player   = require('./Player');
var SongInfo = require('./SongInfo');

/**
 * Footer
 * - Show Player
 * - Show song title / playlist name / artist name.
 */
var SongInfo = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="SongInfo">
        <ul>
          <li>title: {this.props.song.get('title')}</li>
          <li>artist: {this.props.song.get('artist')}</li>
        </ul>
      </div>
    );
  }
});

module.exports = SongInfo;
