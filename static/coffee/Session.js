(function() {
  this.Session = (function() {
    function Session(ctx, player) {
      this.ctx = ctx;
      this.player = player;
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.next_pattern;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.view = new SessionView(this);
    }

    Session.prototype.toggleLoop = function() {
      return this.is_loop = !this.is_loop;
    };

    Session.prototype.nextMeasure = function(synth) {
      this.synth = synth;
      if (this.is_loop) {
        if (this.is_waiting_next_scene) {
          return this.nextScene();
        } else if (this.is_waiting_next_pattern) {
          return this.nextPattern();
        }
      } else {
        return this.nextScene();
      }
    };

    Session.prototype.nextPattern = function() {
      var i, pat, _i, _ref, _results;
      this.is_waiting_next_pattern = false;
      _results = [];
      for (i = _i = 0, _ref = this.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.next_pattern[i] != null) {
          pat = this.song[i][this.next_pattern[i]];
          _results.push(this.synth[i].readPattern(pat));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Session.prototype.nextScene = function(pos) {
      var i, pat, _i, _ref;
      if (pos == null) {
        this.scene_pos++;
        pos = this.scene_pos;
      }
      if (this.scene_pos >= this.song_length) {
        this.player.is_playing = false;
        return;
      }
      for (i = _i = 0, _ref = this.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pat = this.song.tracks[i].patterns[pos].pattern;
        if (pat != null) {
          this.synth[i].readPattern(pat);
          this.scene_length = Math.max(this.scene_length, pat.length);
        }
      }
      this.player.readScene(this.song.master[this.scene_pos]);
      this.player.setSceneLength(this.scene_length);
      return this.view.drawScene(this.scene_pos);
    };

    Session.prototype.getScene = function(i) {
      return this.song.master[i];
    };

    Session.prototype.cue = function(synth_num, pat_num) {
      this.is_waiting_next_pattern = true;
      return this.next_pattern[synth_num] = pat_num;
    };

    Session.prototype.next = function() {
      this.nextScene();
      return this.nextPattern();
    };

    Session.prototype.addSynth = function(s) {};

    Session.prototype.setSynth = function(synth) {
      this.synth = synth;
    };

    Session.prototype.readSong = function(song) {
      var i, _i, _ref;
      this.song = song;
      this.scene_pos = 0;
      this.song_length = 0;
      for (i = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.synth[i].readPattern(this.song.tracks[i].patterns[0].pattern);
        this.song_length = Math.max(this.song_length, song.tracks[i].patterns.length);
      }
      this.player.readScene(song.master[0]);
      return this.view.readSong(song);
    };

    Session.prototype.saveSong = function() {
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

    return Session;

  })();

}).call(this);
