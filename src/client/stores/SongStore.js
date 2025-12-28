import Song from '../models/Song';

const defaultSong = new Song({
  title: 'default song',
  artist: 'anonymous',
  artist_id: null,
  tracks: [{
    name: 'Bass',
    device: {
      name: 'Buzzsaw',
    },
    clips: [{
      name   : 'Intro',
      length : 8
    }, {
      name   : 'Verse',
      length : 8
    }]
  }, {
      name: 'Drum',
      device: {
        name: 'Sampler',
      },
      clips: [{
        name   : 'Intro',
        length : 4
      }]
  }],
  scenes: [{
    name  : 'intro',
    bpm   : 140,
    beats : 4,
  }, {
    name  : 'verse',
    bpm   : 140,
    beats : 3,
  }, {
    name  : 'chorus',
    bpm   : 180,
    beats : 4
  }]
});

const data = {
  currentSong: 0,
  songs: []
};

const SongStore = {
  getSong: function () {
    if (data.songs.length === 0) {
      data.songs.push(defaultSong);
    }
    return data.songs[data.currentSong];
  }
};

export default SongStore;
