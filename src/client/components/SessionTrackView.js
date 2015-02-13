/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

var SessionClipView = require('./SessionClipView');
var SessionCellView = require('./SessionCellView');
var ViewAction = require('../actions/ViewAction');

/**
 * Session View
 */
var _id = 0;
var SessionTrackView = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var isTrackSelected = this.props.selectionTable[this.props.index];

    var cells = [];
    for (let i = 0; i <this.props.song.scenes.length; i++) {
      if (this.props.track.clips[i]) {
        var clip = this.props.track.clips[i];
        cells.push(<SessionClipView clip={clip} trackIndex={this.props.index} index={i} key={clip.id}
          selection={this.props.selection} selectionTable={this.props.selectionTable}/>);
      }
      else {
        cells.push(<SessionCellView trackIndex={this.props.index} index={i} key={_id++}
          selection={this.props.selection} selectionTable={this.props.selectionTable}/>);
      }
    }

    var classes = cx({
      'SessionTrackView': true,
      'selectedTrack': isTrackSelected
    });

    return (
      <div className={classes} onClick={this.onClick} >
        <div className="SessionTrackHeader" >
          {this.props.track.get('name')}
        </div>
        {cells}
      </div>
    );
  },

  onClick: function () {
    console.log('clicked!');
    ViewAction.selectTrack(this.props.index);
  }
});

module.exports = SessionTrackView;
