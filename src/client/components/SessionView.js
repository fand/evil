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
    var tracks = this.props.song.tracks.map((track, i) => {
      console.log(track);
      return (<SessionTrackView track={track} index={i} key={track.id} delegates={this.props.delegates}/>);
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
