/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * Clip View in Session View
 */
var SessionClipView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
        <div className="SessionClipView">
          <div className="SessionClipView-play"
            onClick={this.onClickPlay}></div>
          <div className="SessionClipView-name"
            onClick={this.onClick}>
            {this.props.clip.get('name')}
          </div>
        </div>
    );
  }
});

module.exports = SessionClipView;
