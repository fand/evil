/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

/**
 * Arrangement View
 */
var ArrangementView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    //var tracks = this.props.song.tracks;

    var classes = cx({
      'ArrangementView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        ArrangementView!!!!!!!
      </div>
    );
  }
});

module.exports = ArrangementView;
