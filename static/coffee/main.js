(function() {
  this.STREAM_LENGTH = 1024;

  this.SAMPLE_RATE = 48000;

  this.SEMITONE = 1.05946309;

  this.T = new MutekiTimer();

  $(function() {
    var ua;
    console.log('Welcome to evil!');
    ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/chrome/g)) {
      return initEvil();
    } else {
      return sorry();
    }
  });

  this.sorry = function() {
    $('#top-sorry').show();
    return $('#top-logo-wrapper').addClass('logo-sorry');
  };

  this.initEvil = function() {
    var c1, c2, footer_size, p1, p2, p3, p4, song2, t1, t2,
      _this = this;
    setTimeout((function() {
      $('#top').css({
        opacity: '0'
      }).delay(500).css('z-index', '-1');
      return $('#top-logo').css({
        '-webkit-transform': 'translate3d(0px, -100px, 0px)',
        opacity: '0'
      });
    }), 1500);
    window.CONTEXT = new webkitAudioContext();
    window.player = new Player();
    window.keyboard = new Keyboard(window.player);
    footer_size = $(window).height() / 2 - 300;
    $('footer').css('height', footer_size + 'px');
    if (typeof debug !== "undefined" && debug !== null) {
      p1 = {
        name: 'p1',
        pattern: [10, 10, 17, 10, 17, 10, 16, 10, 10, 10, 17, 10, 17, 10, 16, 10, 8, 8, 17, 8, 17, 8, 16, 8, 9, 9, 17, 9, 17, 9, 16, 9]
      };
      p2 = {
        name: 'p2',
        pattern: [8, 9, 10, 11, 12, 13, 14, 15, 8, 9, 10, 11, 12, 13, 14, 15, 8, 9, 10, 11, 12, 13, 14, 15, 8, 9, 10, 11, 12, 13, 14, 15]
      };
      p3 = {
        name: 'p3',
        pattern: [8, 8, 15, 8, 15, 8, 14, 8, 8, 8, 15, 8, 15, 8, 14, 8, 6, 6, 15, 6, 15, 6, 14, 6, 7, 7, 15, 7, 15, 7, 14, 7]
      };
      p4 = {
        name: 'p4',
        pattern: [10, 11, 12, 13, 14, 15, 16, 17, 10, 11, 12, 13, 14, 15, 16, 17, 10, 11, 12, 13, 14, 15, 16, 17, 10, 11, 12, 13, 14, 15, 16, 17]
      };
      t1 = {
        id: 1,
        name: 'lead',
        patterns: [p1, p2],
        params: [],
        gain: 1.0,
        pan: -1.0
      };
      t2 = {
        id: 2,
        name: 'chorus',
        patterns: [p3, p4],
        params: [],
        gain: 1.0,
        pan: 1.0
      };
      c1 = {
        name: 'intro',
        bpm: 80,
        key: 'A',
        scale: 'IONIAN'
      };
      c2 = {
        name: 'outro',
        bpm: 100,
        key: 'G',
        scale: 'AEOLIAN'
      };
      song2 = {
        title: 'hello',
        creator: 'fand',
        tracks: [t1, t2],
        master: [c1, c2],
        length: 2
      };
      player.readSong(song2);
    }
    if (typeof song_read !== "undefined" && song_read !== null) {
      return player.readSong(song_read);
    }
  };

}).call(this);
