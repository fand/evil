(function() {
  this.Player = (function() {
    function Player() {
      this.bpm = 120;
      this.duration = 500;
      this.key = 'A';
      this.scale = 'IONIAN';
      this.is_playing = false;
      this.time = 0;
      this.scene = {};
      this.num_id = 0;
      this.context = CONTEXT;
      this.synth = [];
      this.mixer = new Mixer(this.context, this);
      this.session = new Session(this.context, this);
      this.addSynth();
      this.synth_now = this.synth[0];
      this.synth_pos = 0;
      this.view = new PlayerView(this);
    }

    Player.prototype.setBPM = function(bpm) {
      var s, _i, _len, _ref, _results;
      this.bpm = bpm;
      this.scene.bpm = this.bpm;
      this.duration = 7500.0 / this.bpm;
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
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.setKey(key));
      }
      return _results;
    };

    Player.prototype.setScale = function(scale) {
      var s, _i, _len, _ref, _results;
      this.scale = scale;
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
      this.session.play();
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
      return this.time = 0;
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
      if ((this.time + 32) > this.scene_length) {
        this.session.nextMeasure(this.synth);
      }
      this.time = (this.time + 32) % this.scene_length;
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.backward = function() {
      if (this.time % 32 < 3 && this.time >= 32) {
        this.time = (this.time - 32 - (this.time % 32)) % this.scene_length;
      } else {
        this.time = this.time - (this.time % 32);
      }
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.toggleLoop = function() {
      return this.session.toggleLoop();
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
        if (this.time >= this.scene_length) {
          this.time = 0;
        }
        _ref = this.synth;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.playAt(this.time);
        }
        if (this.time % 32 === 31) {
          this.session.nextMeasure(this.synth);
        }
        if (this.time % 8 === 0) {
          this.session.beat();
        }
        this.time++;
        return T.setTimeout((function() {
          return _this.playNext();
        }), this.duration);
      } else {
        return this.stop();
      }
    };

    Player.prototype.addSynth = function(scene_pos) {
      var s;
      s = new Synth(this.context, this.num_id++, this);
      s.setScale(this.scene.scale);
      s.setKey(this.scene.key);
      this.synth.push(s);
      this.mixer.addSynth(s);
      return this.session.addSynth(s, scene_pos);
    };

    Player.prototype.moveRight = function(next_idx) {
      this.synth[next_idx - 1].inactivate();
      this.synth_now = this.synth[next_idx];
      this.synth_now.activate(next_idx);
      return this.synth_pos++;
    };

    Player.prototype.moveLeft = function(next_idx) {
      this.synth[next_idx + 1].inactivate();
      this.synth_now = this.synth[next_idx];
      this.synth_now.activate(next_idx);
      return this.synth_pos--;
    };

    Player.prototype.moveTo = function(synth_num) {
      var _results, _results1;
      this.view.moveBottom();
      if (synth_num < this.synth_pos) {
        _results = [];
        while (synth_num !== this.synth_pos) {
          _results.push(this.view.moveLeft());
        }
        return _results;
      } else {
        _results1 = [];
        while (synth_num !== this.synth_pos) {
          _results1.push(this.view.moveRight());
        }
        return _results1;
      }
    };

    Player.prototype.readSong = function(song) {
      this.song = song;
      while (this.song.tracks.length > this.synth.length) {
        this.addSynth();
      }
      this.session.setSynth(this.synth);
      this.session.readSong(song);
      return this.view.setSynthNum(this.synth.length, this.synth_pos);
    };

    Player.prototype.readScene = function(scene) {
      this.scene = scene;
      if (this.scene.bpm != null) {
        this.setBPM(this.scene.bpm);
      }
      if (this.scene.key != null) {
        this.setKey(this.scene.key);
      }
      if (this.scene.scale != null) {
        this.setScale(this.scene.scale);
      }
      return this.view.readParam(this.bpm, this.freq_key, this.scale);
    };

    Player.prototype.setSceneLength = function(scene_length) {
      this.scene_length = scene_length;
    };

    Player.prototype.resetSceneLength = function(l) {
      var s, _i, _len, _ref, _results;
      this.scene_length = 0;
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(this.scene_length = Math.max(this.scene_length, s.pattern.length));
      }
      return _results;
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
