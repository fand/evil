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
    var selectionTable = this._getSelectionTable();

    var tracks = this.props.song.tracks.map((track, i) => {
      return (
        <SessionTrackView
          song={this.props.song} track={track}
          index={i} key={track.id}
          selection={this.props.selection} selectionTable={selectionTable} />
      );
    });

    var classes = cx({
      'SessionView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        <div className="SessionTrackViewWrapper">
          {tracks}
        </div>
      </div>
    );
  },

  _getSelectionTable: function () {
    var track = [];
    for (var x = 0; x < this.props.song.tracks.length; x++) {
      track.push(this.props.selection.currentTrack === x);
    }
    var scene = [];
    for (var y = 0; y < this.props.song.scenes.length; y++) {
      scene.push(this.props.selection.currentScene === y);
    }
    return {
      track: track,
      scene: scene
    };
  }
});

module.exports = SessionView;
