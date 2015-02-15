/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;
var ViewAction = require('../actions/ViewAction');

/**
 * Empty Cell View in Session View
 */
var SessionCellView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var classes = cx({
      'SessionCellView' : true,
      'cell'            : true,
      'bodyCell'        : true,
      'selectedCell'    : this.props.selection.currentCellId === this.props._key,
      'selectedScene'   : this.props.selectionTable.scene[this.props.index]
    });

    return (
      <div className={classes}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick} >
      </div>
    );
  },

  onClick: function () {
    ViewAction.selectCell(this.props.index, this.props._key);
    ViewAction.selectScene(this.props.index);
  },

  onDoubleClick: function () {
    console.log('doubleclickkkkk');
    // ClipsAction.addClip();
    // ClipsAction.editClip();
    ViewAction.selectCell(this.props.index, this.props._key);
  }
});

module.exports = SessionCellView;
