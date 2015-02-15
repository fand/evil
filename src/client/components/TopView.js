/** @jsx React.DOM */
'use strict';

var React = require('react');

// Components
var SessionView     = require('./SessionView');
var ArrangementView = require('./ArrangementView');

// Action
var ViewAction  = require('../actions/ViewAction');

/**
* TopView
* Manages switching SessionView / ArrangementView.
*/
var TopView = React.createClass({
  componentDidMount: function () {
    ViewAction.on('SHOW_ARRANGEMENT', this.showArrangement);
    ViewAction.on('SHOW_SESSION', this.showSession);
  },
  getInitialState: function() {
    return {
      showArrangement : false,
      showSession     : true
    };
  },
  render: function() {
    return (
      <div className="TopView">
        <i className="fa fa-bars btn-arrangement" onClick={this.showArrangement}></i>
        <i className="fa fa-bars btn-session"     onClick={this.showSession}    ></i>
        <SessionView song={this.props.song} isVisible={this.state.showSession} selection={this.props.selection}/>
        <ArrangementView song={this.props.song} isVisible={this.state.showArrangement} selection={this.props.selection}/>
      </div>
    );
  },

  showSession: function () {
    this.setState({
      showSession: true,
      showArrangement: false
    });
  },
  showArrangement: function () {
    this.setState({
      showSession: false,
      showArrangement: true
    });
  }
});

module.exports = TopView;
