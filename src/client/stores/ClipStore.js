import Clip from '../models/Clip';
import TrackStore from './TrackStore.js';

const data = {
  clips       : [],
  currentClip : 0
};

const ClipStore = {
  initClips: function (clips) {
    data.clips = clips.map(t => new Clip(t));
  },
  getCurrentClip: function () {
    const track = TrackStore.getCurrentTrack();
    if (track)  {
      return track.clips[data.currentClip];
    }
    return null;
  },
  getClips: function () {
    return TrackStore.getTracks().reduce((a, t) => { return a.concat(t); }, []);
  },
  addClips: function (clips) {
    const newClips = clips.map(c => new Clip(c));
    data.clips = data.clips.concat(newClips);
    return newClips;
  }
};

export default ClipStore;
