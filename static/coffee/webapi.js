(function() {
  var CONTEXT, KEYCODE_TO_NOTE, KEY_LIST, SAMPLE_RATE, SCALE_LIST, SEMITONE, T;

  SEMITONE = 1.05946309;

  KEY_LIST = {
    A: 55,
    Bb: 58.27047018976124,
    B: 61.7354126570155,
    C: 32.70319566257483,
    Db: 34.64782887210901,
    D: 36.70809598967594,
    Eb: 38.890872965260115,
    E: 41.20344461410875,
    F: 43.653528929125486,
    Gb: 46.2493028389543,
    G: 48.999429497718666,
    Ab: 51.91308719749314
  };

  SCALE_LIST = {
    IONIAN: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16],
    DORIAN: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15],
    PHRYGIAN: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15],
    LYDIAN: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16],
    MIXOLYDIAN: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16],
    AEOLIAN: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
    LOCRIAN: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15]
  };

  CONTEXT = new webkitAudioContext();

  SAMPLE_RATE = CONTEXT.sampleRate;

  T = new MutekiTimer();

  this.Player = (function() {
    function Player() {
      var s, _i, _len, _ref;
      this.bpm = 120;
      this.duration = 500;
      this.freq_key = 55;
      this.scale = [];
      this.is_playing = false;
      this.is_loop = false;
      this.time = 0;
      this.scene_position = 0;
      this.scenes = [];
      this.scene = null;
      this.num_id = 0;
      this.context = CONTEXT;
      this.synth = [new Synth(this.context, this.num_id++, this)];
      this.synth_now = this.synth[0];
      this.synth_pos = 0;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.connect(this.context.destination);
      }
      this.view = new PlayerView(this);
    }

    Player.prototype.setBPM = function(bpm) {
      var s, _i, _len, _ref, _results;
      this.bpm = bpm;
      this.duration = 15.0 / this.bpm * 1000;
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.setDuration(this.duration));
      }
      return _results;
    };

    Player.prototype.setKey = function(key) {
      var s, _i, _len, _ref, _results;
      this.freq_key = KEY_LIST[key];
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.setKey(this.freq_key));
      }
      return _results;
    };

    Player.prototype.setScale = function(scale) {
      var s, _i, _len, _ref, _results;
      this.scale = scale;
      if (!Array.isArray(this.scale)) {
        this.scale = SCALE_LIST[this.scale];
      }
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.setScale(this.scale));
      }
      return _results;
    };

    Player.prototype.isPlaying = function() {
      return this.is_playing;
    };

    Player.prototype.play = function() {
      var _this = this;
      this.is_playing = true;
      return T.setTimeout((function() {
        var s, _i, _len, _ref;
        _ref = _this.synth;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.play();
        }
        return _this.playNext();
      }), 150);
    };

    Player.prototype.playNext = function() {
      var s, _i, _len, _ref,
        _this = this;
      if (this.is_playing) {
        if (this.time >= this.scene_size) {
          this.time = 0;
        }
        _ref = this.synth;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.playAt(this.time);
        }
        this.time++;
        return T.setTimeout((function() {
          return _this.playNext();
        }), this.duration);
      }
    };

    Player.prototype.stop = function() {
      var s, _i, _len, _ref;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.stop();
      }
      this.is_playing = false;
      return this.time = this.scene_size;
    };

    Player.prototype.pause = function() {
      var s, _i, _len, _ref;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.pause(this.time);
      }
      return this.is_playing = false;
    };

    Player.prototype.forward = function() {
      this.time = (this.time + 32) % this.scene_size;
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.backward = function() {
      if (this.time % 32 < 3 && this.time >= 32) {
        this.time = (this.time - 32 - (this.time % 32)) % this.scene_size;
      } else {
        this.time = this.time - (this.time % 32);
      }
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.noteOn = function(note) {
      return this.synth_now.noteOn(note);
    };

    Player.prototype.noteOff = function() {
      return this.synth_now.noteOff();
    };

    Player.prototype.addSynth = function() {
      var s;
      s = new Synth(this.context, this.num_id++, this);
      s.setScale(this.scale);
      s.setKey(this.freq_key);
      s.connect(this.context.destination);
      return this.synth.push(s);
    };

    Player.prototype.moveRight = function(next_idx) {
      this.synth[next_idx - 1].inactivate();
      this.synth_now = this.synth[next_idx];
      return this.synth_now.activate();
    };

    Player.prototype.moveLeft = function(next_idx) {
      this.synth[next_idx + 1].inactivate();
      this.synth_now = this.synth[next_idx];
      return this.synth_now.activate();
    };

    Player.prototype.saveSong = function() {
      var csrf_token, s, song_json,
        _this = this;
      this.scene = {
        size: this.scene_size,
        patterns: (function() {
          var _i, _len, _ref, _results;
          _ref = this.synth;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(s.pattern);
          }
          return _results;
        }).call(this),
        bpm: this.bpm,
        scale: this.scale,
        key: this.key
      };
      this.scenes = [this.scene];
      song_json = JSON.stringify(this.scenes);
      csrf_token = $('#ajax-form > input[name=csrf_token]').val();
      return $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'text',
        data: {
          json: song_json,
          csrf_token: csrf_token
        }
      }).done(function(d) {
        return _this.showSuccess(d);
      }).fail(function(err) {
        return _this.showError(err);
      });
    };

    Player.prototype.readSong = function(scn) {
      if (typeof song_read !== "undefined" && song_read !== null) {
        this.scenes = song_read;
      } else {
        this.scenes = [scn];
      }
      return this.readScene(this.scenes[0]);
    };

    Player.prototype.readScene = function(scene) {
      var i, patterns, _i, _ref;
      this.scene = scene;
      this.scene_size = this.scene.size;
      patterns = this.scene.patterns;
      while (patterns.length > this.synth.length) {
        this.addSynth();
      }
      if (this.scene.bpm != null) {
        this.setBPM(this.scene.bpm);
      }
      if (this.scene.key != null) {
        this.setKey(this.scene.key);
      }
      if (this.scene.scale != null) {
        this.setScale(this.scene.scale);
      }
      this.view.readParam(this.bpm, this.freq_key, this.scale);
      for (i = _i = 0, _ref = patterns.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.synth[i].readPattern(patterns[i]);
      }
      return this.view.synth_total = this.synth.length;
    };

    Player.prototype.setSceneSize = function() {
      var s;
      return this.scene_size = Math.max.apply(null, (function() {
        var _i, _len, _ref, _results;
        _ref = this.synth;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s.pattern.length);
        }
        return _results;
      }).call(this));
    };

    Player.prototype.showSuccess = function(url) {
      console.log("success!");
      return console.log(url);
    };

    Player.prototype.showError = function(error) {
      return console.log(error);
    };

    return Player;

  })();

  this.PlayerView = (function() {
    function PlayerView(model) {
      this.model = model;
      this.dom = $("#control");
      this.bpm = this.dom.find("[name=bpm]");
      this.key = this.dom.find("[name=key]");
      this.scale = this.dom.find("[name=mode]");
      this.setBPM();
      this.setKey();
      this.setScale();
      this.play = $('#control-play');
      this.stop = $('#control-stop');
      this.forward = $('#control-forward');
      this.backward = $('#control-backward');
      this.instruments = $('#instruments');
      this.btn_left = $('#btn-left');
      this.btn_right = $('#btn-right');
      this.synth_now = 0;
      this.synth_total = 1;
      this.btn_save = $('#btn-save');
      this.initEvent();
    }

    PlayerView.prototype.initEvent = function() {
      var _this = this;
      this.dom.on("change", function() {
        _this.setBPM();
        _this.setKey();
        return _this.setScale();
      });
      this.play.on('mousedown', function() {
        if (_this.model.isPlaying()) {
          _this.model.pause();
          return _this.play.removeClass("fa-pause").addClass("fa-play");
        } else {
          _this.model.play();
          return _this.play.removeClass("fa-play").addClass("fa-pause");
        }
      });
      this.stop.on('mousedown', function() {
        _this.model.stop();
        return _this.play.removeClass("fa-pause").addClass("fa-play");
      });
      this.forward.on('mousedown', function() {
        return _this.model.forward();
      });
      this.backward.on('mousedown', function() {
        return _this.model.backward();
      });
      this.btn_left.on('mousedown', function() {
        return _this.moveLeft();
      });
      this.btn_right.on('mousedown', function() {
        return _this.moveRight();
      });
      return this.btn_save.on('click', function() {
        return _this.model.saveSong();
      });
    };

    PlayerView.prototype.setBPM = function() {
      return this.model.setBPM(parseInt(this.bpm.val()));
    };

    PlayerView.prototype.setKey = function() {
      return this.model.setKey(this.key.val());
    };

    PlayerView.prototype.setScale = function() {
      return this.model.setScale(this.scale.val());
    };

    PlayerView.prototype.readParam = function(bpm, key, scale) {
      var k, v, _results;
      this.bpm.val(bpm);
      for (k in SCALE_LIST) {
        v = SCALE_LIST[k];
        if (v = scale) {
          this.scale.val(k);
          break;
        }
      }
      _results = [];
      for (k in KEY_LIST) {
        v = KEY_LIST[k];
        if (v = key) {
          this.key.val(k);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PlayerView.prototype.moveRight = function() {
      if (this.synth_now === (this.synth_total - 1)) {
        this.model.addSynth();
        this.synth_total++;
      }
      this.synth_now++;
      this.instruments.css('-webkit-transform', 'translate3d(' + (-1040 * this.synth_now) + 'px, 0px, 0px)');
      return this.model.moveRight(this.synth_now);
    };

    PlayerView.prototype.moveLeft = function() {
      if (this.synth_now !== 0) {
        this.synth_now--;
        this.instruments.css('-webkit-transform', 'translate3d(' + (-1040 * this.synth_now) + 'px, 0px, 0px)');
        return this.model.moveLeft(this.synth_now);
      }
    };

    return PlayerView;

  })();

  $(function() {
    var footer_size, is_key_pressed, player, scn1, scn2, scn22, scn3, scn55, scn8;
    $("#twitter").socialbutton('twitter', {
      button: 'horizontal',
      text: 'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    });
    $("#hatena").socialbutton('hatena');
    $("#facebook").socialbutton('facebook_like', {
      button: 'button_count'
    });
    player = new Player();
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
        }
      }
    });
    $(window).keyup(function() {
      is_key_pressed = false;
      return player.noteOff();
    });
    footer_size = $(window).height() / 2 - 300;
    $('footer').css('height', footer_size + 'px');
    scn55 = {
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2]]
    };
    scn22 = {
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2], [1, 1, 8, 1, 8, 1, 7, 1, 1, 1, 8, 1, 8, 1, 7, 1, 3, 1, 3, 1, 1, 2, 3, 5, 8, 1, 8, 7, 5, 1, 3, 2]]
    };
    scn1 = {
      size: 32,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2]]
    };
    scn2 = {
      size: 64,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]]
    };
    scn3 = {
      size: 96,
      bpm: 240,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 5, 8, 3, 5, 8, 2, 3, 4, 6, 9, 4, 6, 9, 3, 4, 5, 7, 10, 5, 7, 10, 7, 8, 1, 3, 5, 8, 1, 1]]
    };
    scn8 = {
      bpm: 240,
      size: 256,
      patterns: [[3, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 5, 8, 3, 5, 8, 2, 3, 4, 6, 9, 4, 6, 9, 3, 4, 5, 7, 10, 5, 7, 10, 7, 8, 1, 3, 5, 8, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 10, 3, 10, 3, 10, 3, 9, 3, 3, 3, 10, 3, 10, 3, 9, 3, 1, 1, 10, 1, 10, 1, 9, 1, 2, 2, 10, 2, 10, 2, 9, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 5, 8, 3, 5, 8, 2, 3, 4, 6, 9, 4, 6, 9, 3, 4, 5, 7, 10, 5, 7, 10, 7, 8, 1, 3, 5, 8, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]]
    };
    return player.readSong(scn3);
  });

  KEYCODE_TO_NOTE = {
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

}).call(this);
