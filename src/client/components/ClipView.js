/** @jsx React.DOM */
'use strict';

var React = require('react');

// var PatternConfig = require('./PatternConfig');
// var EnvelopeConfig = require('./EnvelopeConfig');
// var PatternEditor = require('./PatternEditor');
// var EnvelopeEditor = require('./EnvelopeEditor');

var Knob = require('./Knob');

/**
 * CLip View
 * Show clip pattern editer and configs.
 */
var ClipView = React.createClass({
  getInitialState: function() {
    return {
      mode: 'PATTERN'
    };
  },
  render: function() {
    //Name: {this.props.clip.name}
        // <PatternConfig clip={this.props.clip}/>
        // <EnvelopeConfig clip={this.props.clip}/>
        // <PatternEditor clip={this.props.clip}/>
        // <EnvelopeEditor clip={this.props.clip}/>
//        <Knob name="pan" min="-128" max="127" center="C" size="80"/>
    return (
      <div>
        <Knob name="knob test" min="0" max="100" size="100"/>


      </div>
    );
  }
});


module.exports = ClipView;
