(function() {
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

  this.SamplerCore = (function() {
    function SamplerCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 0;
      this.gain = 1.0;
      this.vcos = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
      this.gains = [this.ctx.createGain(), this.ctx.createGain(), this.ctx.createGain()];
      for (i = _i = 0; _i < 3; i = ++_i) {
        this.vcos[i].connect(this.gains[i]);
        this.gains[i].gain.value = 0;
        this.gains[i].connect(this.node);
      }
      this.filter = new ResFilter(this.ctx);
      this.eg = new EG(this.node.gain, 0.0, this.gain);
      this.feg = new EG(this.filter.lpf.frequency, 0, 0);
      this.gain_res = this.ctx.createGain();
      this.gain_res.gain.value = 0;
      this.vcos[2].connect(this.gain_res);
      this.gain_res.connect(this.node);
      this.view = new SamplerCoreView(this, id, this.parent.view.dom.find('.sampler-core'));
    }

    SamplerCore.prototype.setVCOParam = function(i, shape, oct, interval, fine) {
      this.vcos[i].setShape(shape);
      this.vcos[i].setOctave(oct);
      this.vcos[i].setInterval(interval);
      this.vcos[i].setFine(fine);
      return this.vcos[i].setFreq();
    };

    SamplerCore.prototype.setEGParam = function(a, d, s, r) {
      return this.eg.setParam(a, d, s, r);
    };

    SamplerCore.prototype.setFEGParam = function(a, d, s, r) {
      return this.feg.setParam(a, d, s, r);
    };

    SamplerCore.prototype.setFilterParam = function(freq, q) {
      this.feg.setRange(80, Math.pow(freq / 1000, 2.0) * 25000 + 80);
      this.filter.setQ(q);
      if (q > 1) {
        return this.gain_res.value = 0.1 * (q / 1000.0);
      }
    };

    SamplerCore.prototype.setVCOGain = function(i, gain) {
      return this.gains[i].gain.value = (gain / 100.0) * 0.3;
    };

    SamplerCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.eg.setRange(0.0, this.gain);
    };

    SamplerCore.prototype.noteOn = function() {
      var t0;
      t0 = this.ctx.currentTime;
      this.eg.noteOn(t0);
      return this.feg.noteOn(t0);
    };

    SamplerCore.prototype.noteOff = function() {
      var t0;
      t0 = this.ctx.currentTime;
      this.eg.noteOff(t0);
      return this.feg.noteOff(t0);
    };

    SamplerCore.prototype.setKey = function(key) {
      var freq_key, v, _i, _len, _ref, _results;
      freq_key = KEY_LIST[key];
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(v.setKey(freq_key));
      }
      return _results;
    };

    SamplerCore.prototype.setScale = function(scale) {
      this.scale = scale;
    };

    SamplerCore.prototype.connect = function(dst) {
      this.node.connect(this.filter.lpf);
      return this.filter.connect(dst);
    };

    SamplerCore.prototype.setNote = function(note) {
      var v, _i, _len, _ref, _results;
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        v.setNote(note);
        _results.push(v.setFreq());
      }
      return _results;
    };

    return SamplerCore;

  })();

  this.Sampler = (function() {
    function Sampler(ctx, id, player, name) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.name = name;
      if (this.name == null) {
        this.name = 'Sampler #' + this.id;
      }
      this.pattern_name = 'pattern 0';
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      this.time = 0;
      this.scale = [];
      this.view = new SamplerView(this, this.id);
      this.core = new SamplerCore(this, this.ctx, this.id);
      this.is_sustaining = false;
      this.session = this.player.session;
    }

    Sampler.prototype.connect = function(dst) {
      return this.core.connect(dst);
    };

    Sampler.prototype.setDuration = function(duration) {
      this.duration = duration;
    };

    Sampler.prototype.setKey = function(key) {
      return this.core.setKey(key);
    };

    Sampler.prototype.setScale = function(scale_name) {
      return this.scale = SCALE_LIST[scale_name];
    };

    Sampler.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Sampler.prototype.setGain = function(gain) {
      return this.core.setGain(gain);
    };

    Sampler.prototype.getGain = function() {
      return this.core.gain;
    };

    Sampler.prototype.noteToSemitone = function(ival) {
      return Math.floor((ival - 1) / 7) * 12 + this.scale[(ival - 1) % 7];
    };

    Sampler.prototype.noteOn = function(note) {
      this.core.setNote(this.noteToSemitone(note));
      return this.core.noteOn();
    };

    Sampler.prototype.noteOff = function() {
      return this.core.noteOff();
    };

    Sampler.prototype.playAt = function(time) {
      var mytime, n,
        _this = this;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.pattern[mytime] === 0) {
        return this.core.noteOff();
      } else if (this.pattern[mytime] === 'end') {
        return T.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      } else if (this.pattern[mytime] === 'sustain') {

      } else if (this.pattern[mytime] < 0) {
        this.is_sustaining = true;
        n = -this.pattern[mytime];
        this.core.setNote(this.noteToSemitone(n));
        return this.core.noteOn();
      } else {
        this.core.setNote(this.noteToSemitone(this.pattern[mytime]));
        this.core.noteOn();
        return T.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      }
    };

    Sampler.prototype.play = function() {
      return this.view.play();
    };

    Sampler.prototype.stop = function() {
      this.core.noteOff();
      return this.view.stop();
    };

    Sampler.prototype.pause = function(time) {
      return this.core.noteOff();
    };

    Sampler.prototype.readPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.readPattern(this.pattern_obj);
    };

    Sampler.prototype.clearPattern = function() {
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj.pattern = this.pattern;
      return this.view.readPattern(this.pattern_obj);
    };

    Sampler.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.addNote = function(time, note) {
      return this.pattern[time] = note;
    };

    Sampler.prototype.removeNote = function(time) {
      return this.pattern[time] = 0;
    };

    Sampler.prototype.sustainNote = function(l, r, note) {
      var i, _i;
      if (l === r) {
        this.pattern[l] = note;
        return;
      }
      for (i = _i = l; l <= r ? _i < r : _i > r; i = l <= r ? ++_i : --_i) {
        this.pattern[i] = 'sustain';
      }
      this.pattern[l] = -note;
      return this.pattern[r] = 'end';
    };

    Sampler.prototype.activate = function(i) {
      return this.view.activate(i);
    };

    Sampler.prototype.inactivate = function(i) {
      return this.view.inactivate(i);
    };

    Sampler.prototype.redraw = function(time) {
      this.time = time;
      return this.view.drawPattern(this.time);
    };

    Sampler.prototype.setId = function(id) {
      this.id = id;
    };

    Sampler.prototype.setSynthName = function(name) {
      this.name = name;
      this.session.setSynthName(this.id, this.name);
      return this.view.setSynthName(this.name);
    };

    Sampler.prototype.setPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      this.session.setPatternName(this.id, this.pattern_name);
      return this.view.setPatternName(this.pattern_name);
    };

    return Sampler;

  })();

}).call(this);
