(function() {
  var IR_LOADED, IR_URL,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FX = (function() {
    function FX(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createGain();
      this["in"].gain.value = 0.0;
      this.out = this.ctx.createGain();
      this.out.gain.value = 1.0;
    }

    FX.prototype.insert = function(src, dst) {
      src.connect(this["in"]);
      return this.out.connect(dst);
    };

    FX.prototype.setInput = function(d) {
      return this["in"].gain.value = d;
    };

    FX.prototype.setOutput = function(d) {
      return this.out.gain.value = d;
    };

    return FX;

  })();

  this.Delay = (function(_super) {
    __extends(Delay, _super);

    function Delay(ctx) {
      this.ctx = ctx;
      Delay.__super__.constructor.call(this, this.ctx);
      this.delay = this.ctx.createDelay();
      this.delay.delayTime.value = 0.23;
      this.feedback = this.ctx.createGain();
      this.feedback.gain.value = 0.4;
      this["in"].connect(this.delay);
      this.delay.connect(this.out);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.delay);
    }

    Delay.prototype.setDelay = function(d) {
      return this.delay.delayTime.value = d;
    };

    Delay.prototype.setFeedback = function(d) {
      return this.feedback.gain.value = d;
    };

    Delay.prototype.setParam = function(p) {
      if (p.delay != null) {
        this.setDelay(p.delay);
      }
      if (p.feedback != null) {
        this.setFeedback(p.feedback);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        return this.setOutput(p.output);
      }
    };

    return Delay;

  })(this.FX);

  IR_URL = {
    'binaural_1': 'static/IR/binaural/s1_r1_b.wav',
    'binaural_2': 'static/IR/binaural/s1_r2_b.wav',
    'binaural_3': 'static/IR/binaural/s1_r3_b.wav',
    'binaural_4': 'static/IR/binaural/s1_r4_b.wav',
    'binaural_4': 'static/IR/binaural/s1_r4_b.wav',
    'BIG_SNARE': 'static/IR/H3000/206_BIG_SNARE.wav'
  };

  IR_LOADED = {};

  this.Reverb = (function(_super) {
    __extends(Reverb, _super);

    function Reverb(ctx) {
      this.ctx = ctx;
      Reverb.__super__.constructor.call(this, this.ctx);
      this.reverb = this.ctx.createConvolver();
      this["in"].connect(this.reverb);
      this.reverb.connect(this.out);
      this.reverb.connect(this.ctx.destination);
      this.setIR('BIG_SNARE');
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
    }

    Reverb.prototype.setIR = function(name) {
      var req, url,
        _this = this;
      if (IR_LOADED[name] != null) {
        this.reverb.buffer = IR_LOADED[name];
        return;
      }
      url = IR_URL[name];
      if (url == null) {
        return;
      }
      req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = "arraybuffer";
      req.onload = function() {
        return _this.ctx.decodeAudioData(req.response, (function(buffer) {
          _this.reverb.buffer = buffer;
          return IR_LOADED[name] = buffer;
        }), function(err) {
          console.log('ajax error');
          return console.log(err);
        });
      };
      return req.send();
    };

    Reverb.prototype.setParam = function(p) {
      if (p.name != null) {
        this.setIR(p.name);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        return this.setOutput(p.output);
      }
    };

    return Reverb;

  })(this.FX);

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
      this.node_send = this.ctx.createGain();
      this.node_send.gain.value = 1.0;
      this.node_send.connect(this.node);
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
      this.delay = new Delay(this.ctx);
      this.delay.insert(this.node_send, this.node);
      this.reverb = new Reverb(this.ctx);
      this.reverb.insert(this.node_send, this.node);
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
      p.connect(this.node_send);
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
      synth.connect(this.panners[id]);
      return synth.connect(this.analysers[id]);
    };

    return Mixer;

  })();

}).call(this);
