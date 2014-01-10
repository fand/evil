(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Mixer = (function() {
    function Mixer(ctx, player) {
      var i, s, _i, _len, _ref,
        _this = this;
      this.ctx = ctx;
      this.player = player;
      this.addMasterEffect = __bind(this.addMasterEffect, this);
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
      this.out = this.ctx.createGain();
      this.out.gain.value = this.gain_master;
      this.send = this.ctx.createGain();
      this.send.gain.value = 1.0;
      this["return"] = this.ctx.createGain();
      this["return"].gain.value = 1.0;
      this.panners = [];
      this.analysers = [];
      this.splitter_master = this.ctx.createChannelSplitter(2);
      this.analyser_master = [this.ctx.createAnalyser(), this.ctx.createAnalyser()];
      this.out.connect(this.splitter_master);
      _ref = [0, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        this.splitter_master.connect(this.analyser_master[i], i);
        this.analyser_master[i].fftSize = 1024;
        this.analyser_master[i].minDecibels = -100.0;
        this.analyser_master[i].maxDecibels = 0.0;
        this.analyser_master[i].smoothingTimeConstant = 0.0;
      }
      this.limiter = new Limiter(this.ctx);
      this.send.connect(this["return"]);
      this["return"].connect(this.limiter["in"]);
      this.limiter.connect(this.out);
      this.effects_master = [];
      this.out.connect(this.ctx.destination);
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
      this.analysers = [];
      return this.view.empty();
    };

    Mixer.prototype.addSynth = function(synth) {
      var a, p;
      p = new Panner(this.ctx);
      synth.connect(p["in"]);
      p.connect(this.send);
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
      return this.out.gain.value = this.gain_master;
    };

    Mixer.prototype.setPans = function(pan_tracks, pan_master) {
      var i, _i, _ref, _results;
      this.pan_tracks = pan_tracks;
      this.pan_master = pan_master;
      _results = [];
      for (i = _i = 0, _ref = this.pan_tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.panners[i].setPosition(this.pan_tracks[i]));
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
      synth.connect(this.panners[id]["in"]);
      return synth.connect(this.analysers[id]);
    };

    Mixer.prototype.addMasterEffect = function(name) {
      var fx, pos;
      if (name === 'Fuzz') {
        fx = new Fuzz(this.ctx);
      } else if (name === 'Delay') {
        fx = new Delay(this.ctx);
      } else if (name === 'Reverb') {
        fx = new Reverb(this.ctx);
      } else if (name === 'Comp') {
        fx = new Compressor(this.ctx);
      } else if (name === 'Double') {
        fx = new Double(this.ctx);
      }
      pos = this.effects_master.length;
      if (pos === 0) {
        this.send.disconnect();
        this.send.connect(fx["in"]);
      } else {
        this.effects_master[pos - 1].disconnect();
        this.effects_master[pos - 1].connect(fx["in"]);
      }
      fx.connect(this["return"]);
      fx.setSource(this);
      this.effects_master.push(fx);
      return fx;
    };

    Mixer.prototype.addTracksEffect = function(x, name) {
      var fx;
      if (name === 'Fuzz') {
        fx = new Fuzz(this.ctx);
      } else if (name === 'Delay') {
        fx = new Delay(this.ctx);
      } else if (name === 'Reverb') {
        fx = new Reverb(this.ctx);
      } else if (name === 'Comp') {
        fx = new Compressor(this.ctx);
      } else if (name === 'Double') {
        fx = new Double(this.ctx);
      }
      this.player.synth[x].insertEffect(fx);
      return fx;
    };

    Mixer.prototype.removeEffect = function(fx) {
      var i, prev;
      i = this.effects_master.indexOf(fx);
      if (i === -1) {
        return;
      }
      if (i === 0) {
        prev = this.send;
      } else {
        prev = this.effects_master[i - 1];
      }
      this.effects_master[i - 1].disconnect();
      if (this.effects_master[i + 1] != null) {
        prev.connect(this.effects_master[i + 1]);
      } else {
        prev.connect(this["return"]);
        fx.disconnect();
      }
      return this.effects_master.splice(i, 1);
    };

    return Mixer;

  })();

}).call(this);
