/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;
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
    var classes = cx({
      'SessionClipView': true,
      'selected': this.props.selected
    });

    return (
        <div className={classes} draggable>
          <div className="SessionClipView-play"
            onClick={this.onClickPlay}></div>
          <div className="SessionClipView-name"
            onClick={this.onClickClip}
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
    ViewAction.selectClip([this.props.trackIndex, this.props.index]);
  },

  onDoubleClick: function () {
    console.log('doubleclickkkkk');
  }
});

module.exports = SessionClipView;
