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
        <i className="fa fa-play     btn"></i>
        <i className="fa fa-forward  btn"></i>
        <i className="fa fa-backward btn"></i>
        <i className="fa fa-repeat   btn"></i>
      </div>
    );
  }
});

module.exports = Player;
