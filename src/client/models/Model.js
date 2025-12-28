import _ from 'lodash';

class Model {
  constructor (attrs) {
    this.attrs = this.validate(attrs);
    this.listeners = {};
    this.id = _.uniqueId();

    // Init/validation for each sub classes.
    this.initialize.apply(this, arguments);

    Object.observe(this.attrs, changes => this.observe(changes));
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

  // if not valid, set `this.isValid` to false and return normalized value
  validate (attrs) {
    if (! _.isPlainObject(attrs)) {
      return {};
    }
    return attrs;
  }

  getDefaultAttrs () {
    return {};
  }

  watch (key, listener) {
    if (key == null || listener == null) {
      return console.log('>> Model#watch: Wrong arguments.');
    }
    this.listeners[key] = listener;
    return this;
  }

  unwatch (key, listener) {
    if (key == null || listener == null) {
      return console.log('>> Model#unwatch: Wrong arguments.');
    }
    delete this.listeners.key;
    return this;
  }

  observe (changes) {
    changes.forEach(c => {
      if (this.listners[c.name]) {
        this.listeners[c.name](c.object[c.name], c.oldValue);
      }
    });
  }

  toJSON () {
    return _.clone(this.attrs);
  }
}

export default Model;
