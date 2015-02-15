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
var Footer = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="Footer">
        <Player />
        <SongInfo song={this.props.song} />
      </div>
    );
  }
});

module.exports = Footer;
