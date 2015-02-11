/** @jsx React.DOM */
'use strict';

var React = require('react');
var actions = {};
var EvilApp = require('./components/EvilApp');

React.render(<EvilApp />, document.getElementById('app'));
