'use strict';

var Model = require('./Model');
var Clip = require('./Clip');

var _ = require('lodash');

/**
 * Clip - a set of phrase, parameter automation.
 *
 * @attr name String - Clip name.
 * @attr pattern Pattern
 *
 */
class Clip extends Model {
  initialize (attrs) {
    this.attrs.name = this.attrs.name || '';
    //this.pattern = this.attrs.pattern.map(p => );
  }

}
