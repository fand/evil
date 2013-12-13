(function() {
  var OSC_TYPE, SAMPLE_RATE, SEMITONE, STREAM_LENGTH, T;

  SEMITONE = 1.05946309;

  STREAM_LENGTH = 1024;

  SAMPLE_RATE = 48000;

  T = new MutekiTimer();

  OSC_TYPE = {
    RECT: 1,
    SINE: 0,
    SAW: 2,
    TRIANGLE: 3
  };

  this.Noise = (function() {
    function Noise(ctx) {
      var _this = this;
      this.ctx = ctx;
      this.node = this.ctx.createScriptProcessor(STREAM_LENGTH);
      this.node.onaudioprocess = function(event) {
        var data_L, data_R, i, _i, _ref, _results;
        data_L = event.outputBuffer.getChannelData(0);
        data_R = event.outputBuffer.getChannelData(1);
        _results = [];
        for (i = _i = 0, _ref = data_L.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(data_L[i] = data_R[i] = Math.random());
        }
        return _results;
      };
    }

    Noise.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    Noise.prototype.setOctave = function(_) {
      return null;
    };

    Noise.prototype.setFine = function(_) {
      return null;
    };

    Noise.prototype.setNote = function() {
      return null;
    };

    Noise.prototype.setInterval = function(_) {
      return null;
    };

    Noise.prototype.setFreq = function() {
      return null;
    };

    Noise.prototype.setKey = function() {
      return null;
    };

    Noise.prototype.setShape = function(shape) {};

    return Noise;

  })();

  this.VCO = (function() {
    function VCO(ctx) {
      this.ctx = ctx;
      this.freq_key = 55;
      this.octave = 4;
      this.interval = 0;
      this.fine = 0;
      this.note = 0;
      this.freq = Math.pow(2, this.octave) * this.freq_key;
      this.node = this.ctx.createOscillator();
      this.node.type = 'sine';
      this.setFreq();
      this.node.start(0);
    }

    VCO.prototype.setOctave = function(octave) {
      this.octave = octave;
    };

    VCO.prototype.setFine = function(fine) {
      this.fine = fine;
      return this.node.detune.value = this.fine;
    };

    VCO.prototype.setNote = function(note) {
      this.note = note;
    };

    VCO.prototype.setKey = function(freq_key) {
      this.freq_key = freq_key;
    };

    VCO.prototype.setInterval = function(interval) {
      this.interval = interval;
    };

    VCO.prototype.setShape = function(shape) {
      return this.node.type = OSC_TYPE[shape];
    };

    VCO.prototype.setFreq = function() {
      this.freq = (Math.pow(2, this.octave) * Math.pow(SEMITONE, this.interval + this.note) * this.freq_key) + this.fine;
      return this.node.frequency.setValueAtTime(this.freq, 0);
    };

    VCO.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    return VCO;

  })();

  this.EG = (function() {
    function EG(target, min, max) {
      this.target = target;
      this.min = min;
      this.max = max;
      this.attack = 0;
      this.decay = 0;
      this.sustain = 0.0;
      this.release = 0;
    }

    EG.prototype.getParam = function() {
      return [this.attack, this.decay, this.sustain, this.release];
    };

    EG.prototype.setParam = function(attack, decay, sustain, release) {
      this.attack = attack / 50000.0;
      this.decay = decay / 50000.0;
      this.sustain = sustain / 100.0;
      return this.release = release / 50000.0;
    };

    EG.prototype.setRange = function(min, max) {
      this.min = min;
      this.max = max;
    };

    EG.prototype.getRange = function() {
      return [this.min, this.max];
    };

    EG.prototype.noteOn = function(time) {
      this.target.cancelScheduledValues(time);
      this.target.setValueAtTime(this.min, time);
      this.target.linearRampToValueAtTime(this.max, time + this.attack);
      return this.target.linearRampToValueAtTime(this.sustain * (this.max - this.min) + this.min, time + this.attack + this.decay);
    };

    EG.prototype.noteOff = function(time) {
      this.target.cancelScheduledValues(time);
      return this.target.linearRampToValueAtTime(this.min, time + this.release);
    };

    return EG;

  })();

  this.ResFilter = (function() {
    function ResFilter(ctx) {
      this.ctx = ctx;
      this.lpf = this.ctx.createBiquadFilter();
      this.lpf.type = 'lowpass';
      this.lpf.gain.value = 1.0;
    }

    ResFilter.prototype.connect = function(dst) {
      return this.lpf.connect(dst);
    };

    ResFilter.prototype.getResonance = function() {
      return this.lpf.Q.value;
    };

    ResFilter.prototype.setQ = function(Q) {
      return this.lpf.Q.value = Q;
    };

    return ResFilter;

  })();

  this.SynthCore = (function() {
    function SynthCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 0;
      this.vco = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
      this.gain = [this.ctx.createGain(), this.ctx.createGain(), this.ctx.createGain()];
      for (i = _i = 0; _i < 3; i = ++_i) {
        this.vco[i].connect(this.gain[i]);
        this.gain[i].gain.value = 0;
        this.gain[i].connect(this.node);
      }
      this.filter = new ResFilter(this.ctx);
      this.eg = new EG(this.node.gain, 0.0, 1.0);
      this.feg = new EG(this.filter.lpf.frequency, 0, 0);
      this.gain_res = this.ctx.createGain();
      this.gain_res.gain.value = 0;
      this.vco[2].connect(this.gain_res);
      this.gain_res.connect(this.node);
      this.view = new SynthCoreView(this, id, this.parent.view.dom.find('.core'));
    }

    SynthCore.prototype.setVCOParam = function(i, shape, oct, interval, fine) {
      this.vco[i].setShape(shape);
      this.vco[i].setOctave(oct);
      this.vco[i].setInterval(interval);
      this.vco[i].setFine(fine);
      return this.vco[i].setFreq();
    };

    SynthCore.prototype.setEGParam = function(a, d, s, r) {
      return this.eg.setParam(a, d, s, r);
    };

    SynthCore.prototype.setFEGParam = function(a, d, s, r) {
      return this.feg.setParam(a, d, s, r);
    };

    SynthCore.prototype.setFilterParam = function(freq, q) {
      this.feg.setRange(80, Math.pow(freq / 1000, 2.0) * 25000 + 80);
      this.filter.setQ(q);
      if (q > 1) {
        return this.gain_res.value = 0.1 * (q / 1000.0);
      }
    };

    SynthCore.prototype.setGain = function(i, gain) {
      return this.gain[i].gain.value = (gain / 100.0) * 0.3;
    };

    SynthCore.prototype.noteOn = function() {
      var t0;
      t0 = this.ctx.currentTime;
      this.eg.noteOn(t0);
      return this.feg.noteOn(t0);
    };

    SynthCore.prototype.noteOff = function() {
      var t0;
      t0 = this.ctx.currentTime;
      this.eg.noteOff(t0);
      return this.feg.noteOff(t0);
    };

    SynthCore.prototype.setKey = function(freq_key) {
      var v, _i, _len, _ref, _results;
      _ref = this.vco;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(v.setKey(freq_key));
      }
      return _results;
    };

    SynthCore.prototype.setScale = function(scale) {
      this.scale = scale;
    };

    SynthCore.prototype.connect = function(dst) {
      this.node.connect(this.filter.lpf);
      return this.filter.connect(dst);
    };

    SynthCore.prototype.setNote = function(note) {
      var v, _i, _len, _ref, _results;
      _ref = this.vco;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        v.setNote(note);
        _results.push(v.setFreq());
      }
      return _results;
    };

    return SynthCore;

  })();

  this.SynthCoreView = (function() {
    function SynthCoreView(model, id, dom) {
      this.model = model;
      this.id = id;
      this.dom = dom;
      this.vcos = $(this.dom.find('.vco'));
      this.EG_inputs = this.dom.find('.EG > input');
      this.FEG_inputs = this.dom.find('.FEG > input');
      this.filter_inputs = this.dom.find(".filter input");
      this.gain_inputs = this.dom.find('.gain > input');
      this.canvasEG = this.dom.find(".canvasEG").get()[0];
      this.canvasFEG = this.dom.find(".canvasFEG").get()[0];
      this.contextEG = this.canvasEG.getContext('2d');
      this.contextFEG = this.canvasFEG.getContext('2d');
      this.initEvent();
    }

    SynthCoreView.prototype.initEvent = function() {
      var _this = this;
      this.vcos.on("change", function() {
        return _this.setVCOParam();
      });
      this.gain_inputs.on("change", function() {
        return _this.setGain();
      });
      this.filter_inputs.on("change", function() {
        return _this.setFilterParam();
      });
      this.EG_inputs.on("change", function() {
        return _this.setEGParam();
      });
      this.FEG_inputs.on("change", function() {
        return _this.setFEGParam();
      });
      return this.setParam();
    };

    SynthCoreView.prototype.updateCanvas = function(name) {
      var adsr, canvas, context, h, w, w4;
      canvas = null;
      context = null;
      adsr = null;
      if (name === "EG") {
        canvas = this.canvasEG;
        context = this.contextEG;
        adsr = this.model.eg.getParam();
      } else {
        canvas = this.canvasFEG;
        context = this.contextFEG;
        adsr = this.model.feg.getParam();
      }
      w = canvas.width = 180;
      h = canvas.height = 50;
      w4 = w / 4;
      context.clearRect(0, 0, w, h);
      context.beginPath();
      context.moveTo(w4 * (1.0 - adsr[0]), h);
      context.lineTo(w / 4, 0);
      context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]));
      context.lineTo(w4 * 3, h * (1.0 - adsr[2]));
      context.lineTo(w4 * (adsr[3] + 3), h);
      context.strokeStyle = 'rgb(0, 220, 255)';
      return context.stroke();
    };

    SynthCoreView.prototype.setParam = function() {
      this.setVCOParam();
      this.setEGParam();
      this.setFEGParam();
      this.setFilterParam();
      return this.setGain();
    };

    SynthCoreView.prototype.setVCOParam = function() {
      var i, vco, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        vco = this.vcos.eq(i);
        _results.push(this.model.setVCOParam(i, vco.find('.shape').val(), parseInt(vco.find('.octave').val()), parseInt(vco.find('.interval').val()), parseInt(vco.find('.fine').val())));
      }
      return _results;
    };

    SynthCoreView.prototype.setEGParam = function() {
      this.model.setEGParam(parseFloat(this.EG_inputs.eq(0).val()), parseFloat(this.EG_inputs.eq(1).val()), parseFloat(this.EG_inputs.eq(2).val()), parseFloat(this.EG_inputs.eq(3).val()));
      return this.updateCanvas("EG");
    };

    SynthCoreView.prototype.setFEGParam = function() {
      this.model.setFEGParam(parseFloat(this.FEG_inputs.eq(0).val()), parseFloat(this.FEG_inputs.eq(1).val()), parseFloat(this.FEG_inputs.eq(2).val()), parseFloat(this.FEG_inputs.eq(3).val()));
      return this.updateCanvas("FEG");
    };

    SynthCoreView.prototype.setFilterParam = function() {
      return this.model.setFilterParam(parseFloat(this.filter_inputs.eq(0).val()), parseFloat(this.filter_inputs.eq(1).val()));
    };

    SynthCoreView.prototype.setGain = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.gain_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.model.setGain(i, parseInt(this.gain_inputs.eq(i).val())));
      }
      return _results;
    };

    return SynthCoreView;

  })();

  this.Synth = (function() {
    function Synth(ctx, id, player) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.time = 0;
      this.scale = [];
      this.view = new SynthView(this);
      this.core = new SynthCore(this, this.ctx, this.id);
    }

    Synth.prototype.connect = function(dst) {
      return this.core.connect(dst);
    };

    Synth.prototype.setDuration = function(duration) {
      this.duration = duration;
    };

    Synth.prototype.setKey = function(key) {
      return this.core.setKey(key);
    };

    Synth.prototype.setScale = function(scale) {
      this.scale = scale;
    };

    Synth.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Synth.prototype.noteToSemitone = function(ival) {
      return Math.floor((ival - 1) / 7) * 12 + this.scale[(ival - 1) % 7];
    };

    Synth.prototype.noteOn = function(note) {
      this.core.setNote(this.noteToSemitone(note));
      return this.core.noteOn();
    };

    Synth.prototype.noteOff = function() {
      return this.core.noteOff();
    };

    Synth.prototype.playAt = function(time) {
      var mytime,
        _this = this;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.pattern[mytime] === 0) {
        return this.core.noteOff();
      } else {
        this.core.setNote(this.noteToSemitone(this.pattern[mytime]));
        this.core.noteOn();
        return T.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      }
    };

    Synth.prototype.play = function() {
      return this.view.play();
    };

    Synth.prototype.stop = function() {
      this.core.noteOff();
      return this.view.stop();
    };

    Synth.prototype.pause = function(time) {
      return this.core.noteOff();
    };

    Synth.prototype.readPattern = function(pattern) {
      this.pattern = pattern;
      return this.view.readPattern(this.pattern);
    };

    Synth.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      return this.player.setSceneSize();
    };

    Synth.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.setSceneSize();
    };

    Synth.prototype.addNote = function(time, note) {
      return this.pattern[time] = note;
    };

    Synth.prototype.removeNote = function(time) {
      return this.pattern[time] = 0;
    };

    Synth.prototype.activate = function(i) {
      return this.view.activate(i);
    };

    Synth.prototype.inactivate = function(i) {
      return this.view.inactivate(i);
    };

    Synth.prototype.redraw = function(time) {
      this.time = time;
      this.view.drawPattern(this.time);
      return this.view.playAt(this.time);
    };

    return Synth;

  })();

}).call(this);
