/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _master = {
  name: 'section-0',
  bpm: 144,
  key: 'A',
  scale: 'minor',
};

const SONG_DEFAULT = {
  tracks: [],
  length: 1,
  master: [_master],
};

class Song {
  static DEFAULT = SONG_DEFAULT;
}

// Export!
export default Song;
