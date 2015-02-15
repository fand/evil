/** @jsx React.DOM */
'use strict';

var React = require('react');

var Player   = require('./Player');
var SongInfo = require('./SongInfo');

/**
 * Player
 * - Emits events about playing.
 */
var Player = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="Player">
        <i className="fa fa-play"></i>
        <i className="fa fa-forward"></i>
        <i className="fa fa-backward"></i>
        <i className="fa fa-repeat"></i>
      </div>
    );
  }
});

module.exports = Player;
