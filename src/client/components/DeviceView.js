/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * Device View
 * Edit Device (Synth, Instruments) parameters.
 */
var DeviceView = React.createClass({
  getInitialState: function() {
    return {
      
    };
  },
  render: function() {
    var effects =this.props.device.fx.map(f => f.render());
    return (
      <div>
        Name: {this.props.device.name}
        deviceconfig
        {effects}
      </div>
    );
  }
});


module.exports = DeviceView;
