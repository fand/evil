(function() {
  this.Session = (function() {
    function Session(ctx, player) {
      this.ctx = ctx;
      this.player = player;
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.current_cells = [];
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.cue_queue = [];
      this.view = new SessionView(this);
    }

    Session.prototype.toggleLoop = function() {
      return this.is_loop = !this.is_loop;
    };

    Session.prototype.nextMeasure = function(synth) {
      this.synth = synth;
      if (this.is_loop) {
        if (this.is_waiting_next_scene) {
          return this.nextScene(this.next_scene_pos);
        } else if (this.is_waiting_next_pattern) {
          return this.nextPattern();
        }
      } else {
        return this.nextScene();
      }
    };

    Session.prototype.nextPattern = function() {
      var pat, q, _i, _len, _ref;
      this.is_waiting_next_pattern = false;
      _ref = this.cue_queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        q = _ref[_i];
        pat = this.song.tracks[q[0]].patterns[q[1]].pattern;
        this.synth[q[0]].readPattern(pat);
        this.current_cells[q[0]] = q[1];
      }
      this.view.drawScene(this.scene_pos, this.current_cells);
      this.next_pattern_pos = [];
      return this.cue_queue = [];
    };

    Session.prototype.nextScene = function(pos) {
      var i, pat, _i, _ref;
      this.is_waiting_next_scene = false;
      if (pos == null) {
        this.scene_pos++;
        pos = this.scene_pos;
      } else {
        this.scene_pos = pos;
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
          this.current_cells[i] = pos;
        }
      }
      this.player.readScene(this.song.master[this.scene_pos]);
      this.player.setSceneLength(this.scene_length);
      this.view.drawScene(this.scene_pos);
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      return this.cue_queue = [];
    };

    Session.prototype.getScene = function(i) {
      return this.song.master[i];
    };

    Session.prototype.beat = function() {
      if (this.is_waiting_next_scene) {
        return this.view.beat(true, [0, this.next_scene_pos]);
      } else {
        return this.view.beat(false, this.cue_queue);
      }
    };

    Session.prototype.cuePattern = function(synth_num, pat_num) {
      this.is_waiting_next_pattern = true;
      this.next_pattern_pos[synth_num] = pat_num;
      return this.cue_queue.push([synth_num, pat_num]);
    };

    Session.prototype.cueScene = function(scene_num) {
      this.is_waiting_next_scene = true;
      return this.next_scene_pos = scene_num;
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
      var i, pat, _i, _ref;
      this.song = song;
      this.scene_pos = 0;
      this.song_length = 0;
      this.scene_length = 0;
      for (i = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pat = this.song.tracks[i].patterns[0].pattern;
        if (pat != null) {
          this.synth[i].readPattern(this.song.tracks[i].patterns[0].pattern);
          this.current_cells[i] = 0;
        }
        this.song_length = Math.max(this.song_length, song.tracks[i].patterns.length);
        this.scene_length = Math.max(this.scene_length, song.tracks[i].patterns[0].pattern.length);
      }
      this.player.readScene(song.master[0]);
      this.player.setSceneLength(this.scene_length);
      return this.view.readSong(song, this.current_cells);
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
