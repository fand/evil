'use strict';

var _ = require('lodash');

class Model {
  constructor (attrs) {
    this.attrs = this.validate(attrs);
    this.initialize.apply(this, arguments);
  }

  get (key) {
    return this.attrs[key];
  }

  set (key, val) {
    var attrs;
    if (key == null) { return this; }

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (typeof key === 'object') {
      attrs = key;
    }
    else {
      (attrs = {})[key] = val;
    }

    if (!this.isValid(attrs)) { return false; }
    return this;
  }

  unset (key) {
    delete this.attrs.key;
    return this;
  }

  // Clear all attributes on the model, firing `"change"`.
  clear (options) {
    var attrs = {};
    for (var key in this.attrs) {
      attrs[key] = 0;
    }
    return this.set(attrs);
  }

  // Create a new model with identical attributes to this one.
  clone () {
    return new this.constructor(this.attributes);
  }

  // !== null && !== undefined
  has (key) {
    return this.get(key) != null;
  }

  isValid (attrs) {
    if (! _.isPlainObject(attrs)) { return false; }
    return true;
  }

  validate (attrs) {
    if (this.isValid(attrs)) {
      return attrs;
    }
    else {
      this.getDefaultAttrs();
    }
  }

  getDefaultAttrs () {
    return {};
  }

  toJSON () {
    return _.clone(this.attrs);
  }
}

module.exports = Model;
