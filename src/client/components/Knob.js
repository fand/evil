/** @jsx React.DOM */
'use strict';

var React = require('react');

const DEGREE = (Math.PI / 180.0);
const STARTANGLE = -225 * DEGREE;
const RATIO = (1.0 / 1000.0) * 270.0 * DEGREE;

var getEndAngle = function (value) {
  return value * RATIO + STARTANGLE;
};

/**
 * Knob
 */
var Knob = React.createClass({
  data: {},
  getInitialState: function() {
    return {
      value: 1000
    };
  },
  componentDidMount: function () {
    this.data.canvas = this.refs.canvas.getDOMNode();
    this.data.ctx = this.data.canvas.getContext('2d');

    this.data.ctx.lineWidth = this.props.lineWidth || 5;
    this.data.ctx.strokeStyle = 'rgba(80, 180, 255, 1.0)';

    this.data.size = this.props.size || 100;
    this.data.mid = this.data.size * 0.5;
    this.data.radius = this.props.radius || this.data.size * 0.5 - this.data.ctx.lineWidth * 2;

    this.render();
  },
  render: function() {
    if (this.data.ctx) {
      this.data.ctx.clearRect(0, 0, this.data.size, this.data.size);
      this.data.ctx.beginPath();
      var endAngle = getEndAngle(this.state.value);

      this.data.ctx.arc(this.data.mid, this.data.mid, this.data.radius, STARTANGLE, endAngle, false);
      this.data.ctx.stroke();
    }

    return (
      <div>
        name: {this.props.name}
        value: {this.state.value / 1000.0 * (this.props.max - this.props.min)}
        <canvas key={this.props.name} ref="canvas" width={this.data.size} height={this.data.size}></canvas>
      </div>
    );
  }
});


module.exports = Knob;
