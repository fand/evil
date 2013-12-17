(function() {
  this.Session = (function() {
    function Session(synth) {
      this.synth = synth;
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.next_pattern;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.view = new SessionView(this);
    }

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
      var i, pat, _i, _ref, _results;
      if (pos == null) {
        this.scene_pos++;
        pos = this.scene_pos;
      }
      _results = [];
      for (i = _i = 0, _ref = this.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pat = this.song[i][pos];
        if (pat != null) {
          _results.push(this.synth[i].readPattern(pat));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Session.prototype.cue = function(synth_num, pat_num) {
      this.is_waiting_next_pattern = true;
      return this.next_pattern[synth_num] = pat_num;
    };

    Session.prototype.next = function() {
      this.nextScene();
      return this.nextPattern();
    };

    Session.prototype.addSynth = function(s) {
      return this.view.addSynth();
    };

    return Session;

  })();

}).call(this);
