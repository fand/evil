(function() {
  this.Mixer = (function() {
    function Mixer(ctx, player) {
      var i, s, _i, _len, _ref,
        _this = this;
      this.ctx = ctx;
      this.player = player;
      this.gain_master = 1.0;
      this.gain_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.player.synth;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s.getGain());
        }
        return _results;
      }).call(this);
      this.node = this.ctx.createGain();
      this.node.gain.value = this.gain_master;
      this.node.connect(this.ctx.destination);
      this.panners = [];
      this.analysers = [];
      this.splitter_master = this.ctx.createChannelSplitter(2);
      this.analyser_master = [this.ctx.createAnalyser(), this.ctx.createAnalyser()];
      this.node.connect(this.splitter_master);
      _ref = [0, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        this.splitter_master.connect(this.analyser_master[i], i);
        this.analyser_master[i].fftSize = 1024;
        this.analyser_master[i].minDecibels = -100.0;
        this.analyser_master[i].maxDecibels = 0.0;
        this.analyser_master[i].smoothingTimeConstant = 0.0;
      }
      this.view = new MixerView(this);
      setInterval((function() {
        return _this.drawGains();
      }), 30);
    }

    Mixer.prototype.drawGains = function() {
      var data, data_l, data_r, i, _i, _ref;
      for (i = _i = 0, _ref = this.analysers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        data = new Uint8Array(this.analysers[i].frequencyBinCount);
        this.analysers[i].getByteTimeDomainData(data);
        this.view.drawGainTracks(i, data);
      }
      data_l = new Uint8Array(this.analyser_master[0].frequencyBinCount);
      data_r = new Uint8Array(this.analyser_master[1].frequencyBinCount);
      this.analyser_master[0].getByteTimeDomainData(data_l);
      this.analyser_master[1].getByteTimeDomainData(data_r);
      return this.view.drawGainMaster(data_l, data_r);
    };

    Mixer.prototype.empty = function() {
      this.gain_tracks = [];
      this.panners = [];
      return this.view.empty();
    };

    Mixer.prototype.addSynth = function(synth) {
      var a, p;
      p = this.ctx.createPanner();
      p.panningModel = "equalpower";
      synth.connect(p);
      p.connect(this.node);
      this.panners.push(p);
      a = this.ctx.createAnalyser();
      synth.connect(a);
      this.analysers.push(a);
      return this.view.addSynth(synth);
    };

    Mixer.prototype.removeSynth = function(i) {
      return this.panners.splice(i);
    };

    Mixer.prototype.setGains = function(gain_tracks, gain_master) {
      var i, _i, _ref;
      this.gain_tracks = gain_tracks;
      this.gain_master = gain_master;
      for (i = _i = 0, _ref = this.gain_tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.player.synth[i].setGain(this.gain_tracks[i]);
      }
      return this.node.gain.value = this.gain_master;
    };

    Mixer.prototype.setPans = function(pan_tracks, pan_master) {
      var i, p, _i, _ref, _results;
      this.pan_tracks = pan_tracks;
      this.pan_master = pan_master;
      _results = [];
      for (i = _i = 0, _ref = this.pan_tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = this.pan_tracks[i];
        _results.push(this.panners[i].setPosition(p[0], p[1], p[2]));
      }
      return _results;
    };

    Mixer.prototype.readGains = function(gain_tracks, gain_master) {
      this.gain_tracks = gain_tracks;
      this.gain_master = gain_master;
      this.setGains(this.gain_tracks, this.gain_master);
      return this.view.readGains(this.gain_tracks, this.gain_master);
    };

    Mixer.prototype.readPans = function(pan_tracks, pan_master) {
      this.pan_tracks = pan_tracks;
      this.pan_master = pan_master;
      this.setPans(this.pan_tracks, this.pan_master);
      return this.view.readPans(this.pan_tracks, this.pan_master);
    };

    Mixer.prototype.getParam = function() {
      return {
        gain_tracks: this.gain_tracks,
        gain_master: this.gain_master,
        pan_tracks: this.pan_tracks,
        pan_master: this.pan_master
      };
    };

    Mixer.prototype.readParam = function(p) {
      if (p == null) {
        return;
      }
      this.readGains(p.gain_tracks, p.gain_master);
      return this.readPans(p.pan_tracks, p.pan_master);
    };

    Mixer.prototype.changeSynth = function(id, synth) {
      return synth.connect(this.panners[id]);
    };

    return Mixer;

  })();

}).call(this);
