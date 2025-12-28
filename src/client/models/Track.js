import Model from './Model';
import DeviceStore from '../stores/DeviceStore';
import ClipStore from '../stores/ClipStore';

class Track extends Model {
  initialize () {
    this.device = DeviceStore.addDevice(this.attrs.device);
    this.clips  = ClipStore.addClips(this.attrs.clips);
  }

  validate (attrs) {
    attrs.clips = attrs.clips || [];
    return attrs;
  }

  toJSON () {
    var json = super.toJSON.apply(this);
    json.clips = this.clips.map(c => c.toJSON());
    json.device = this.device.toJSON();
  }
}

export default Track;
