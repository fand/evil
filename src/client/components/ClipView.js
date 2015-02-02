/** @jsx React.DOM */
'use strict';

var React = require('react');

var PatternConfig = require('./PatternConfig');
var EnvelopeConfig = require('./EnvelopeConfig');
var PatternEditor = require('./PatternEditor');
var EnvelopeEditor = require('./EnvelopeEditor');

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
    return (
      <div>
        Name: {this.props.clip.name}
        <PatternConfig clip={this.props.clip}/>
        <EnvelopeConfig clip={this.props.clip}/>
        <PatternEditor clip={this.props.clip}/>
        <EnvelopeEditor clip={this.props.clip}/>
      </div>
    );
  }
});


module.exports = ClipView;
