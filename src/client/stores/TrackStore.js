import { EventEmitter } from 'eventemitter3';
import Dispatcher from '../Dispatcher';
import Track from '../models/Track';

const data = {
  tracks: []
};

class TrackStore extends EventEmitter {
  initTracks (tracks) {
    data.tracks = tracks.map(t => new Track(t));
  }
  getTracks () {
    return data.tracks;
  }
  getTrack (idx) {
    return data.tracks[idx];
  }
  getCurrentTrack () {
    return data.tracks[data.currentTrack];
  }
  addTracks (tracks) {
    const newTracks = tracks.map(t => new Track(t));
    data.tracks = data.tracks.concat(newTracks);
    return newTracks;
  }
}

export default new TrackStore();
