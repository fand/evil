(function() {
  this.KEY_LIST = {
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

  this.SCALE_LIST = {
    IONIAN: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16],
    DORIAN: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15],
    PHRYGIAN: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15],
    LYDIAN: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16],
    MIXOLYDIAN: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16],
    AEOLIAN: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
    LOCRIAN: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15]
  };

  this.Player = (function() {
    function Player() {
      var s, _i, _len, _ref;
      this.bpm = 120;
      this.duration = 500;
      this.freq_key = 55;
      this.scale = [];
      this.is_playing = false;
      this.is_loop = true;
      this.time = 0;
      this.scene_pos = 0;
      this.scenes = [];
      this.scene = {};
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
      this.scene.bpm = this.bpm;
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
      this.scene.key = key;
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
      this.scene.scale = this.scale;
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

    Player.prototype.stop = function() {
      var s, _i, _len, _ref;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.stop();
      }
      this.is_playing = false;
      this.view.viewStop();
      this.time = 0;
      this.scene_pos = 0;
      this.scene = this.scenes[0];
      return this.readScene(this.scene);
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

    Player.prototype.toggleLoop = function() {
      return this.is_loop = !this.is_loop;
    };

    Player.prototype.noteOn = function(note) {
      return this.synth_now.noteOn(note);
    };

    Player.prototype.noteOff = function() {
      return this.synth_now.noteOff();
    };

    Player.prototype.playNext = function() {
      var s, _i, _len, _ref,
        _this = this;
      if (this.is_playing) {
        if ((!this.is_loop) && this.time >= this.scene_size) {
          if (this.scene_pos === this.scenes.length - 1) {
            this.stop();
            return;
          } else {
            this.time = 0;
            this.scene_pos++;
            this.scene = this.scenes[this.scene_pos];
            this.readScene(this.scene);
          }
        }
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
      return this.synth_now.activate(next_idx);
    };

    Player.prototype.moveLeft = function(next_idx) {
      this.synth[next_idx + 1].inactivate();
      this.synth_now = this.synth[next_idx];
      return this.synth_now.activate(next_idx);
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

    Player.prototype.readSong = function(song) {
      var o;
      if (typeof song_read !== "undefined" && song_read !== null) {
        this.scenes = song_read;
      } else {
        this.scenes = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = song.length; _i < _len; _i++) {
            o = song[_i];
            _results.push(o);
          }
          return _results;
        })();
      }
      return this.readScene(this.scenes[0]);
    };

    Player.prototype.readScene = function(scene) {
      var i, patterns, _i, _ref;
      this.scene = scene;
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
      this.view.synth_total = this.synth.length;
      return this.setSceneSize();
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

}).call(this);
