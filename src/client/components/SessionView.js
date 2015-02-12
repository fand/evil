/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

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
      return (<SessionTrackView track={track} index={i} key={track.id} />);
    });

    var classes = cx({
      'SessionView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        SessionView!!!!!!!!!!!!!!!!!!!!!!!!!!!
        <div className="SessionTrackViewWrapper">
          {tracks}
        </div>
      </div>
    );
  }
});

module.exports = SessionView;
