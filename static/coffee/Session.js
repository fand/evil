(function() {
  var SONG_DEFAULT, _master;

  _master = {
    name: 'section-0',
    bpm: 120,
    key: 'A',
    scale: 'Major'
  };

  SONG_DEFAULT = {
    tracks: [],
    length: 1,
    master: [_master]
  };

  this.Session = (function() {
    function Session(ctx, player) {
      this.ctx = ctx;
      this.player = player;
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.scene_length = 32;
      this.current_cells = [];
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.cue_queue = [];
      this.song = SONG_DEFAULT;
      this.view = new SessionView(this, this.song);
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
      this.savePatterns();
      this.is_waiting_next_pattern = false;
      _ref = this.cue_queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        q = _ref[_i];
        pat = this.song.tracks[q[0]].patterns[q[1]];
        this.synth[q[0]].readPattern(pat);
        this.current_cells[q[0]] = q[1];
      }
      this.view.drawScene(this.scene_pos, this.current_cells);
      this.next_pattern_pos = [];
      return this.cue_queue = [];
    };

    Session.prototype.nextScene = function(pos) {
      var i, pat, _i, _ref;
      this.savePatterns();
      this.is_waiting_next_scene = false;
      if (pos == null) {
        this.scene_pos++;
        pos = this.scene_pos;
      } else {
        this.scene_pos = pos;
      }
      if (this.scene_pos >= this.song.length) {
        this.player.is_playing = false;
        this.view.clearAllActive();
        this.scene_pos = this.next_scene_pos = 0;
        return;
      }
      for (i = _i = 0, _ref = this.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.song.tracks[i].patterns[pos] == null) {
          continue;
        }
        pat = this.song.tracks[i].patterns[pos];
        if (pat != null) {
          this.synth[i].readPattern(pat);
          this.scene_length = Math.max(this.scene_length, pat.pattern.length);
          this.current_cells[i] = pos;
        }
      }
      if (this.song.master[this.scene_pos] != null) {
        this.player.readScene(this.song.master[this.scene_pos]);
      }
      this.player.setSceneLength(this.scene_length);
      this.view.readSong(this.song, this.current_cells);
      this.view.drawScene(this.scene_pos, this.current_cells);
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      return this.cue_queue = [];
    };

    Session.prototype.getScene = function(i) {
      return this.song.master[i];
    };

    Session.prototype.play = function() {
      return this.view.drawScene(this.scene_pos, this.current_cells);
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

    Session.prototype.addSynth = function(s, _pos) {
      var name, patterns, pos, s_obj;
      pos = _pos ? _pos : this.scene_pos;
      name = s.id + '-' + pos;
      s.readPatternName(name);
      patterns = [];
      patterns[pos] = {
        name: s.pattern_name,
        pattern: s.pattern
      };
      s_obj = {
        id: s.id,
        type: s.type,
        name: s.name,
        patterns: patterns,
        params: [],
        gain: 1.0,
        pan: 0.0
      };
      this.song.tracks.push(s_obj);
      this.current_cells.push(pos);
      return this.view.addSynth(this.song);
    };

    Session.prototype.setSynth = function(synth) {
      this.synth = synth;
    };

    Session.prototype.readTrack = function(song, src, dst) {
      var name, synth_num;
      this.song = song;
      if (this.song.master[dst.y] == null) {
        this.song.master[dst.y] = {
          name: 'section-' + dst.y
        };
      }
      if (dst.y + 1 > this.song.length) {
        this.song.length = dst.y + 1;
      }
      name = this.song.tracks[src.x].patterns[src.y].name;
      synth_num = dst.x;
      if (this.song.tracks.length <= dst.x) {
        synth_num = this.song.tracks.length;
        if (this.song.tracks[src.x].type === 'REZ') {
          this.player.addSynth(dst.y);
        } else if (this.song.tracks[src.x].type === 'SAMPLER') {
          this.player.addSampler(dst.y);
        }
      }
      return this.song.tracks.length - 1;
    };

    Session.prototype.readPattern = function(pat, synth_num, pat_num) {
      this.song.tracks[synth_num].patterns[pat_num] = pat;
      if (this.song.master[pat_num] == null) {
        this.song.master[pat_num] = {
          name: 'section-' + pat_num
        };
      }
      if (pat_num + 1 > this.song.length) {
        this.song.length = pat_num + 1;
      }
      if (this.current_cells[synth_num] = pat_num) {
        return this.player.synth[synth_num].readPattern(pat);
      }
    };

    Session.prototype.readMaster = function(pat, pat_num) {
      this.song.master[pat_num] = pat;
      if (pat_num + 1 > this.song.length) {
        return this.song.length = pat_num + 1;
      }
    };

    Session.prototype.editPattern = function(_synth_num, pat_num) {
      var pat_name, synth_num;
      if (this.song.master[pat_num] == null) {
        this.song.master[pat_num] = {
          name: 'section-' + pat_num
        };
      }
      if (pat_num + 1 > this.song.length) {
        this.song.length = pat_num + 1;
      }
      synth_num = _synth_num;
      if (this.song.tracks.length <= _synth_num) {
        synth_num = this.song.tracks.length;
        this.player.addSynth(pat_num);
      }
      this.savePattern(synth_num, this.current_cells[synth_num]);
      if (this.song.tracks[synth_num].patterns[pat_num] != null) {
        this.player.synth[synth_num].readPattern(this.song.tracks[synth_num].patterns[pat_num]);
      } else {
        pat_name = synth_num + '-' + pat_num;
        this.player.synth[synth_num].clearPattern();
        this.player.synth[synth_num].readPatternName(pat_name);
        this.song.tracks[synth_num].patterns[pat_num] = this.player.synth[synth_num].getPattern();
      }
      this.current_cells[synth_num] = pat_num;
      this.view.readSong(this.song, this.current_cells);
      this.player.moveTo(synth_num);
      return [synth_num, pat_num, this.song.tracks[synth_num].patterns[pat_num]];
    };

    Session.prototype.savePatterns = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.current_cells.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.savePattern(i, this.current_cells[i]));
      }
      return _results;
    };

    Session.prototype.savePattern = function(x, y) {
      if (this.song.tracks[x].patterns[y] != null) {
        return this.song.tracks[x].patterns[y].pattern = this.player.synth[x].pattern;
      } else {
        return this.song.tracks[x].patterns[y] = {
          pattern: this.player.synth[x].pattern
        };
      }
    };

    Session.prototype.saveTracks = function() {
      var i, param, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.player.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        param = this.player.synth[i].getParam();
        if (this.song.tracks[i].patterns != null) {
          param.patterns = this.song.tracks[i].patterns;
        }
        _results.push(this.song.tracks[i] = param);
      }
      return _results;
    };

    Session.prototype.saveMaster = function(y, obj) {
      this.song.master[y] = obj;
      return this.view.readSong(this.song, this.current_cells);
    };

    Session.prototype.saveMasters = function() {
      if (this.song.master === []) {
        return this.song.master.push(this.player.getScene());
      } else {

      }
    };

    Session.prototype.saveMixer = function() {
      return this.song.mixer = this.player.mixer.getParam();
    };

    Session.prototype.readTracks = function(tracks) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.player.synth[i].readParam(tracks[i]));
      }
      return _results;
    };

    Session.prototype.readSong = function(song) {
      var i, pat, _i, _ref;
      this.song = song;
      this.scene_pos = 0;
      this.scene_length = 0;
      for (i = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pat = this.song.tracks[i].patterns[0].pattern;
        if (pat != null) {
          this.synth[i].readPattern(this.song.tracks[i].patterns[0]);
          this.current_cells[i] = 0;
        }
        this.scene_length = Math.max(this.scene_length, song.tracks[i].patterns[0].pattern.length);
      }
      this.player.readScene(this.song.master[0]);
      this.player.setSceneLength(this.scene_length);
      this.readTracks(this.song.tracks);
      this.player.mixer.readParam(this.song.mixer);
      return this.view.readSong(this.song, this.current_cells);
    };

    Session.prototype.saveSong = function() {
      var csrf_token, song_json,
        _this = this;
      this.savePatterns();
      this.saveTracks();
      this.saveMasters();
      this.saveMixer();
      song_json = JSON.stringify(this.song);
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
        return _this.view.showSuccess(d, _this.song.title, _this.song.creator);
      }).fail(function(err) {
        return _this.view.showError(err);
      });
    };

    Session.prototype.setSynthName = function(synth_id, name) {
      this.song.tracks[synth_id].name = name;
      return this.view.drawTrackName(synth_id, name, this.song.tracks[synth_id].type);
    };

    Session.prototype.setPatternName = function(synth_id, name) {
      var pat_num;
      pat_num = this.current_cells[synth_id];
      if (this.song.tracks[synth_id].patterns[pat_num] != null) {
        this.song.tracks[synth_id].patterns[pat_num].name = name;
      } else {
        this.song.tracks[synth_id].patterns[pat_num] = {
          name: name
        };
      }
      return this.view.drawPatternName(synth_id, pat_num, this.song.tracks[synth_id].patterns[pat_num]);
    };

    Session.prototype.setSongTitle = function(title) {
      return this.song.title = this.view.song.title = title;
    };

    Session.prototype.setCreatorName = function(name) {
      return this.song.creator = this.view.song.creator = name;
    };

    Session.prototype.changeSynth = function(id, type) {
      var pat_name, pp, s, s_obj, _ref;
      s = this.player.changeSynth(id, type);
      pat_name = s.id + '-' + this.scene_pos;
      s.readPatternName(pat_name);
      pp = [];
      pp[this.scene_pos] = {
        name: pat_name,
        pattern: s.pattern
      };
      s_obj = {
        id: s.id,
        type: type,
        name: 'Synth #' + s.id,
        patterns: pp,
        params: [],
        gain: 1.0,
        pan: 0.0
      };
      this.song.tracks[id] = s_obj;
      s.readPattern(pp[this.scene_pos]);
      _ref = [this.song.tracks[id].patterns[this.current_cells[id]], this.song.tracks[id].patterns[0]], this.song.tracks[id].patterns[0] = _ref[0], this.song.tracks[id].patterns[this.current_cells[id]] = _ref[1];
      return this.view.addSynth(this.song, [id, this.scene_pos]);
    };

    Session.prototype.empty = function() {
      this.next_pattern_pos = [];
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.scene_length = 32;
      this.current_cells = [];
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.cue_queue = [];
      return this.song = {
        tracks: [],
        master: [],
        length: 0,
        mixer: []
      };
    };

    Session.prototype.deleteCell = function() {
      var p;
      p = this.view.getSelectPos();
      if (p == null) {
        return;
      }
      if (p.type === 'tracks') {
        this.song.tracks[p.x].patterns[p.y] = void 0;
        if (this.current_cells[p.x] === p.y) {
          this.player.synth[p.x].clearPattern();
          this.current_cells[p.x] = void 0;
        }
        return this.view.readSong(this.song, this.current_cells);
      } else if (p.type === 'master') {
        this.song.master[p.y] = {
          name: this.song.master[p.y].name
        };
        return this.view.readSong(this.song, this.current_cells);
      }
    };

    return Session;

  })();

}).call(this);
