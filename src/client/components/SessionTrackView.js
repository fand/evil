/** @jsx React.DOM */
'use strict';

var React = require('react');

var SessionClipView = require('./SessionClipView');
var ViewAction = require('../actions/ViewAction');

/**
 * Session View
 */
var SessionTrackView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var clips = this.props.track.clips.map((clip, i) => {
      return (<SessionClipView clip={clip} trackIndex={this.props.index} index={i} key={clip.id} />);
    });
    return (
      <div className="SessionTrackView" onClick={this.onClick}>
        <div className="SessionTrackHeader" >
          {this.props.track.get('name')}
        </div>
        {clips}
      </div>
    );
  },

  onClick: function () {
    ViewAction.selectTrack(this.props.index);
  }
});

module.exports = SessionTrackView;
