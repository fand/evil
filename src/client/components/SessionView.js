/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * Session View
 */
var SessionView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var tracks = this.props.song.tracks.map((track) => {
      return (<li key={track.id}>{track.id}</li>);
    });

    return (
      <div>
        SessionView!!!!!!!!!!!!!!!!!!!!!!!!!!!
        <ul>
          {tracks}
        </ul>
      </div>
    );
  }
});

module.exports = SessionView;
