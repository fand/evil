/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

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
    //var effects = this.props.device.fx.map(f => f.render());
    var effects = '';

    var classes = cx({
      'DeviceView': true,
      'visible': this.props.isVisible
    });
    return (
      <div className={classes}>
        deviceconfig
        {effects}
      </div>
    );
  }
});


module.exports = DeviceView;
