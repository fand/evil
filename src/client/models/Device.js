import Model from './Model';
import ContextStore from '../stores/ContextStore';


/**
 * Device - Synth, Sampler, etc...
 * @param opts.name   String
 * @param opts.scenes Array[scene_id]
 */

class Device extends Model {
  initialize (attrs) {
    // Validate & fallback to default values.
    this.ctx = ContextStore.getContext();
    this.out = this.ctx.createGain();

    // Observe attrs
    this.watch('gain', v => this.out.gain.value(v));
  }

  validate (attrs) {
    attrs.name = attrs.name || '';
    return attrs;
  }

  connect (dst) {
    this.out.connect(dst);
  }

  disconnect (dst) {
    this.out.disconnect(dst);
  }

  noteOn (note) {

  }

  noteOff () {

  }
}

export default Device;
