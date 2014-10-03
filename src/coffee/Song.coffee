_master =
    name: 'section-0'
    bpm: 144
    key: 'A'
    scale: 'minor'

SONG_DEFAULT =
    tracks: []
    length: 1
    master: [_master]


class Song
    @DEFAULT = SONG_DEFAULT


# Export!
module.exports = Song
