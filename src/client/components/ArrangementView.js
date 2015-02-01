/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * Arrangement View
 */
var ArrangementView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var tracks = this.props.song.tracks;
    return (
      <div>
        ArrangementView!!!!!!!
      </div>
    );
  }
});

module.exports = ArrangementView;
