/** @jsx React.DOM */
'use strict';

var React = require('react');
var ViewAction = require('../actions/ViewAction');

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
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}>
            {this.props.clip.get('name')}
          </div>
        </div>
    );
  },

  onClickPlay: function () {
    console.log('yoyaku: ' + this.props.trackIndex + ' - ' + this.props.index);
  },

  onClickClip: function () {
    ViewAction.selectClip(this.props.index);
  },

  onDoubleClick: function () {
    console.log('doubleclickkkkk');
  }
});

module.exports = SessionClipView;
