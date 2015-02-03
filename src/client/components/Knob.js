/** @jsx React.DOM */
'use strict';

var React = require('react');

const colorMain = 'rgb(80, 180, 255)';
const colorSub  = 'rgb(220, 220, 220)';



const DEGREE = (Math.PI / 180.0);
const STARTANGLE = -225 * DEGREE;
const ENDANGLE = 45 * DEGREE;
const RATIO = (1.0 / 1000.0) * 270.0 * DEGREE;

var getCurrentAngle = function (value) {
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

    this.data.lineWidth = this.props.lineWidth || 7;

    this.data.size = this.props.size || 100;
    this.data.mid = this.data.size * 0.5;
    this.data.radius = this.props.radius || this.data.size * 0.4 - this.data.lineWidth * 2;

    this.render();
  },
  render: function() {
    if (this.data.ctx) {
      this.data.ctx.clearRect(0, 0, this.data.size, this.data.size);

      var currentAngle = getCurrentAngle(this.state.value);
      this.data.ctx.lineWidth = this.data.lineWidth;

      this.data.ctx.strokeStyle = colorSub;
      this.data.ctx.beginPath();
      this.data.ctx.arc(this.data.mid, this.data.mid, this.data.radius, STARTANGLE, ENDANGLE, false);
      this.data.ctx.stroke();

      this.data.ctx.strokeStyle = colorMain;
      this.data.ctx.beginPath();
      this.data.ctx.arc(this.data.mid, this.data.mid, this.data.radius, STARTANGLE, currentAngle, false);
      this.data.ctx.stroke();

    }

    return (
      <div>
        name: {this.props.name}
        <canvas key={this.props.name} ref="canvas" width={this.data.size} height={this.data.size}></canvas>
        <div>
          <input type="range" value={this.state.value} min="0" max="1000" onChange={this.onChange} />
        </div>
        value: {this.state.value / 1000.0 * (this.props.max - this.props.min)}
      </div>
    );
  },
  onChange: function (e) {
    this.setState({value: e.target.value});
  }
});


module.exports = Knob;
