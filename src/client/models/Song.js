'use strict';

var Model = require('./Model');
var Scene = require('./Scene');

/**
 * Song Model.
 * @param opts.title   String
 * @param opts.user_id String
 * @param opts.scenes  Array[scene_id]
 */

class Song extends Model {
  initialize (attrs) {
    // Validate & fallback to default values.
    this.attrs.title   = this.attrs.title || '';
    this.attrs.user_id = this.attrs.user_id || 0;
    this.attrs.scenes  = this.attrs.scenes || [];
    this.scenes = this.attrs.scenes.map((s) => new Scene(s));
    // this.tracks = this.attrs.tracks.map((t) => new Track(t));
  }

  toJSON () {
    var json = super.toJSON.apply(this);
    json.scenes = this.scenes.map((s) => s.toJSON());
    return json;
  }
}

module.exports = Song;
