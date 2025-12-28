import Model from './Model';
import SceneStore from '../stores/SceneStore.js';
import TrackStore from '../stores/TrackStore.js';

/**
 * Song Model.
 * @param opts.title   String
 * @param opts.user_id String
 * @param opts.scenes  Array[scene_id]
 */

class Song extends Model {
  initialize (attrs) {
    this.scenes = SceneStore.addScenes(this.attrs.scenes);
    this.tracks = TrackStore.addTracks(this.attrs.tracks);
  }

  // Validate & fallback to default values.
  validate (attrs) {
    attrs.title   = attrs.title || '';
    attrs.user_id = attrs.user_id || 0;
    attrs.scenes  = attrs.scenes || [];
    attrs.tracks  = attrs.tracks || [];
    return attrs;
  }

  getDefaultAttrs () {
    return {
      title: '',
      user_id: 0,
      scenes: [],
      tracks: []
    };
  }

  toJSON () {
    var json = super.toJSON.apply(this);
    json.scenes = this.scenes.map((s) => s.toJSON());
    return json;
  }
}

export default Song;
