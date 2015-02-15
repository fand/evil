/** @jsx React.DOM */
'use strict';

var React = require('react');

// Components
var ClipView   = require('./ClipView');
var DeviceView = require('./DeviceView');

// Action
var ViewAction  = require('../actions/ViewAction');

/**
* BottomView
* Manages switching ClipView / DeviceView.
*/
var BottomView = React.createClass({
  componentDidMount: function () {
    ViewAction.on('SHOW_DEVICE', this.showDevice);
    ViewAction.on('SHOW_CLIP', this.showClip);
  },
  getInitialState: function() {
    return {
      showArrangement : false,
      showSession     : true
    };
  },
  render: function() {
    return (
      <div className="BottomView">
        <i className="fa fa-bars btn-device" onClick={this.showDevice}></i>
        <i className="fa fa-bars btn-clip"   onClick={this.showClip}  ></i>
        <DeviceView song={this.props.song} isVisible={this.state.showDevice} selection={this.props.selection}/>
        <ClipView   song={this.props.song} isVisible={this.state.showClip}   selection={this.props.selection}/>
      </div>
    );
  },

  // Control Visibility for each View.
  showDevice: function () {
    this.setState({
      showDevice: true,
      showClip: false
    });
  },
  showClip: function () {
    this.setState({
      showDevice: false,
      showClip: true
    });
  }
});

module.exports = BottomView;
