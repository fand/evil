# A module for constants used by multiple modules.

KEY_LIST =
    A:  55
    Bb: 58.27047018976124
    B:  61.7354126570155
    C:  32.70319566257483
    Db: 34.64782887210901
    D:  36.70809598967594
    Eb: 38.890872965260115
    E:  41.20344461410875
    F:  43.653528929125486
    Gb: 46.2493028389543
    G:  48.999429497718666
    Ab: 51.91308719749314

SCALE_LIST =
    Major:      [0,2,4,5,7,9,11]
    minor:      [0,2,3,5,7,8,10]
    Pentatonic: [0,3,5,7,10]
    Dorian:     [0,2,3,5,7,9,10]
    Phrygian:   [0,1,3,5,7,8,10]
    Lydian:     [0,2,4,6,7,9,11]
    Mixolydian: [0,2,4,5,7,9,10]
    CHROMATIC:  [0,1,2,3,4,5,6,7,8,9,10,11]
    'Harm-minor': [0,2,3,5,7,8,11]

STREAM_LENGTH = 1024
SEMITONE = 1.05946309


module.exports =
    KEY_LIST: KEY_LIST
    SCALE_LIST: SCALE_LIST
    STREAM_LENGTH: STREAM_LENGTH
    SEMITONE: SEMITONE
