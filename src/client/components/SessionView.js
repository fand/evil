/** @jsx React.DOM */
'use strict';

var React = require('react');

var SessionTrackView = require('./SessionTrackView');



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
      return (<SessionTrackView track={track} key={track.id} />);
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
