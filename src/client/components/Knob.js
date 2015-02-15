/** @jsx React.DOM */
'use strict';

var React = require('react');

const kColorMain = 'rgb(80, 180, 255)';
const kColorSub  = 'rgb(220, 220, 220)';

const kDegree = (Math.PI / 180.0);
const kStartAngle = -225 * kDegree;
const kEndAngle = 45 * kDegree;
const kRatio = (1.0 / 1000.0) * 270.0 * kDegree;

var getCurrentAngle = function (value) {
  return value * kRatio + kStartAngle;
};

/**
 * Knob
 */
var Knob = React.createClass({
  data: {},
  getInitialState: function() {
    return {
      value: 500
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

      this.data.ctx.strokeStyle = kColorSub;
      this.data.ctx.beginPath();
      this.data.ctx.arc(this.data.mid, this.data.mid, this.data.radius, kStartAngle, kEndAngle, false);
      this.data.ctx.stroke();

      this.data.ctx.strokeStyle = kColorMain;
      this.data.ctx.beginPath();
      this.data.ctx.arc(this.data.mid, this.data.mid, this.data.radius, kStartAngle, currentAngle, false);
      this.data.ctx.stroke();

    }
    this.data.size = this.data.size || this.props.size || 100;
    var valueStr = this.getValueStr();
    return (
      <div>
        name: {this.props.name}
        <canvas ref="canvas"
          width={this.data.size} height={this.data.size}
          onMouseDown={this.onDragStart}
          ></canvas>
        value: {valueStr}
      </div>
    );
  },

  getValueStr: function () {
    var val = (this.state.value / 1000.0 * (this.props.max - this.props.min)).toString();
    return val.slice(0, 4);
  },

  onDragStart: function (e) {
    this.data.dragStart = e.clientY - e.clientX;
    this.data.dragStartValue = this.state.value;
    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.onDragEnd);
    e.stopPropagation();
    e.preventDefault();
  },
  onDrag: function (e) {
    if (typeof this.data.dragStart === 'undefined') { return; }
    var currentPos = e.clientY - e.clientX;
    var diff = this.data.dragStart - currentPos;
    var newValue = this.data.dragStartValue + (diff * 10.0);
    newValue = Math.min(Math.max(0, newValue), 1000);
    this.setState({value: newValue});
    e.stopPropagation();
    e.preventDefault();
  },
  onDragEnd: function (e) {
    this.data.dragStart = null;
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onDragEnd);
    e.stopPropagation();
    e.preventDefault();
  }

});


module.exports = Knob;
