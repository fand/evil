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
      'SessionCellView': true,
      'selectedCell': this.props.selection.currentCell === this.props.key,
      'selectedScene': this.props.selectionTable.scene[this.props.index]
    });

    return (
      <div className={classes}
        onDoubleClick={this.onDoubleClick} />
    );
  },

  onDoubleClick: function () {
    console.log('doubleclickkkkk');
    // ClipsAction.addClip();
    // ClipsAction.editClip();
    ViewAction.selectClip(this.props.index);
  }
});

module.exports = SessionCellView;
