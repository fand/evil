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
    var footer_size,
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
    if (typeof song_read !== "undefined" && song_read !== null) {
      return player.readSong(song_read);
    } else {
      return player.readSong(SONG_DEFAULT);
    }
  };

}).call(this);
