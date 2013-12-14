(function() {
  this.CONTEXT = new webkitAudioContext();

  this.STREAM_LENGTH = 1024;

  this.SAMPLE_RATE = 48000;

  this.SEMITONE = 1.05946309;

  this.T = new MutekiTimer();

  this.KEYCODE_TO_NOTE = {
    90: 1,
    88: 2,
    67: 3,
    86: 4,
    66: 5,
    78: 6,
    77: 7,
    65: 8,
    83: 9,
    68: 10,
    188: 8,
    190: 9,
    192: 10,
    70: 11,
    71: 12,
    72: 13,
    74: 14,
    75: 15,
    76: 16,
    187: 17,
    81: 15,
    87: 16,
    69: 17,
    82: 18,
    84: 19,
    89: 20,
    85: 21,
    73: 22,
    79: 23,
    80: 24,
    49: 22,
    50: 23,
    51: 24,
    52: 25,
    53: 26,
    54: 27,
    55: 28,
    56: 29,
    57: 30,
    48: 31
  };

  $(function() {
    var footer_size, is_key_pressed, s1, s2, scn1, scn2, scn55, song1;
    window.player = new Player();
    is_key_pressed = false;
    $(window).keydown(function(e) {
      var n;
      if (is_key_pressed === false) {
        is_key_pressed = true;
        if (player.isPlaying()) {
          player.noteOff();
        }
        n = KEYCODE_TO_NOTE[e.keyCode];
        if (n != null) {
          return player.noteOn(n);
        } else {
          switch (e.keyCode) {
            case 37:
              player.view.moveLeft();
              return console.log('eleft');
            case 38:
              player.view.moveTop();
              return console.log('top');
            case 39:
              return player.view.moveRight();
            case 40:
              return player.view.moveBottom();
            case 32:
              return player.view.viewPlay();
            case 13:
              return player.view.viewPlay();
          }
        }
      }
    });
    $(window).keyup(function() {
      is_key_pressed = false;
      return player.noteOff();
    });
    footer_size = $(window).height() / 2 - 300;
    $('footer').css('height', footer_size + 'px');
    scn1 = {
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2]]
    };
    scn2 = {
      size: 64,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]]
    };
    scn55 = {
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2]]
    };
    s1 = {
      bpm: 80,
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [1, 1, 8, 1, 8, 1, 7, 1, 1, 1, 8, 1, 8, 1, 7, 1, 3, 3, 8, 3, 8, 3, 7, 3, 5, 5, 8, 5, 8, 5, 9, 5]]
    };
    s2 = {
      size: 32,
      patterns: [[1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8], [3, 4, 5, 6, 7, 8, 9, 10, 3, 4, 5, 6, 7, 8, 9, 10, 3, 4, 5, 6, 7, 8, 9, 10, 3, 4, 5, 6, 7, 8, 9, 10]]
    };
    song1 = [s1, s2];
    player.readSong(song1);
    $("#twitter").socialbutton('twitter', {
      button: 'horizontal',
      text: 'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    });
    $("#hatena").socialbutton('hatena');
    return $("#facebook").socialbutton('facebook_like', {
      button: 'button_count'
    });
  });

}).call(this);
