/** @jsx React.DOM */
'use strict';

var React = require('react');

var SessionClipView = require('./SessionClipView');


/**
 * Session View
 */
var SessionTrackView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var clips = this.props.track.clips.map((clip) => {
      console.log(clip);
      return (<SessionClipView clip={clip} key={clip.id} />);
    });

    return (
      <div className="SessionTrackView">
        <div className="SessionTrackHeader"
          onClick={this.onClick}>
          {this.props.track.name}
        </div>
        {clips}
      </div>
    );
  },

  onClick: function () {
    ;
  }
});

module.exports = SessionTrackView;
