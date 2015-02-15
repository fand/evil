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
      'SessionClipView' : true,
      'cell'            : true,
      'bodyCell'        : true,
      'selectedCell'    : this.props.selection.currentCellId === this.props._key,
      'selectedScene'   : this.props.selectionTable.scene[this.props.index]
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
    ViewAction.selectCell(this.props.index, this.props._key);
    ViewAction.selectScene(this.props.index);
  },

  onDoubleClick: function () {
    console.log('doubleclickkkkk');
  }
});

module.exports = SessionClipView;
