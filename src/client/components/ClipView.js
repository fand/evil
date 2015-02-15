/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

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
    if (this.props.clip == null) {
      return <div />;
    }
    // <PatternConfig clip={this.props.clip}/>
    // <EnvelopeConfig clip={this.props.clip}/>
    // <PatternEditor clip={this.props.clip}/>
    // <EnvelopeEditor clip={this.props.clip}/>
    //        <Knob name="pan" min="-128" max="127" center="C" size="80"/>

    var classes = cx({
      'ClipView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        <Knob name="knob test" min="0" max="100" size="100"/>
        Name: {this.props.clip.get('name')}
      </div>
    );
  }
});


module.exports = ClipView;
