(function() {
  var SAMPLES_DEFAULT;

  this.SampleNode = (function() {
    function SampleNode(ctx, id, parent) {
      var eq1, eq2, eq3, _ref, _ref1, _ref2, _ref3, _ref4;
      this.ctx = ctx;
      this.id = id;
      this.parent = parent;
      this.out = this.ctx.createGain();
      this.out.gain.value = 1.0;
      this.name = SAMPLES_DEFAULT[this.id];
      this.setSample(this.name);
      this.head = 0.0;
      this.tail = 1.0;
      this.speed = 1.0;
      this.merger = this.ctx.createChannelMerger(2);
      this.node_buf = this.ctx.createGain();
      this.node_buf.gain.value = 1.0;
      this.eq_gains = [0.0, 0.0, 0.0];
      _ref = [this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter()], eq1 = _ref[0], eq2 = _ref[1], eq3 = _ref[2];
      _ref1 = ['lowshelf', 'peaking', 'highshelf'], eq1.type = _ref1[0], eq2.type = _ref1[1], eq3.type = _ref1[2];
      _ref2 = [0.6, 0.6, 0.6], eq1.Q.value = _ref2[0], eq2.Q.value = _ref2[1], eq3.Q.value = _ref2[2];
      _ref3 = [350, 2000, 4000], eq1.frequency.value = _ref3[0], eq2.frequency.value = _ref3[1], eq3.frequency.value = _ref3[2];
      _ref4 = this.eq_gains, eq1.gain.value = _ref4[0], eq2.gain.value = _ref4[1], eq3.gain.value = _ref4[2];
      this.eq_nodes = [eq1, eq2, eq3];
      this.panner = new Panner(this.ctx);
      this.pan_value = 0.5;
      this.node_buf.connect(eq1);
      eq1.connect(eq2);
      eq2.connect(eq3);
      eq3.connect(this.panner["in"]);
      this.panner.connect(this.out);
    }

    SampleNode.prototype.setSample = function(name) {
      var req, sample,
        _this = this;
      this.name = name;
      sample = SAMPLES[this.name];
      if (sample == null) {
        return;
      }
      this.sample = sample;
      if (sample.data != null) {
        return this.buffer = sample.data;
      } else {
        req = new XMLHttpRequest();
        req.open('GET', sample.url, true);
        req.responseType = "arraybuffer";
        req.onload = function() {
          _this.ctx.decodeAudioData(req.response, (function(buffer) {
            _this.buffer = buffer;
            _this.buffer_duration = _this.buffer.length / window.SAMPLE_RATE;
            return _this.parent.sampleLoaded(_this.id);
          }), function(err) {
            console.log('ajax error');
            return console.log(err);
          });
          return sample.data = _this.buffer;
        };
        return req.send();
      }
    };

    SampleNode.prototype.connect = function(dst) {
      this.dst = dst;
      return this.out.connect(this.dst);
    };

    SampleNode.prototype.noteOn = function(gain, time) {
      var head_time, source, tail_time;
      if (this.buffer == null) {
        return;
      }
      if (this.source_old != null) {
        this.source_old.stop(time);
      }
      source = this.ctx.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.merger, 0, 0);
      source.connect(this.merger, 0, 1);
      this.merger.connect(this.node_buf);
      head_time = time + this.buffer_duration * this.head;
      tail_time = time + this.buffer_duration * this.tail;
      source.playbackRate.value = this.speed;
      source.start(0);
      this.node_buf.gain.value = gain;
      return this.source_old = source;
    };

    SampleNode.prototype.setTimeParam = function(head, tail, speed) {
      this.head = head;
      this.tail = tail;
      this.speed = speed;
    };

    SampleNode.prototype.getTimeParam = function() {
      return [this.head, this.tail, this.speed];
    };

    SampleNode.prototype.setEQParam = function(eq_gains) {
      var g, _ref;
      this.eq_gains = eq_gains;
      return _ref = (function() {
        var _i, _len, _ref, _results;
        _ref = this.eq_gains;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          _results.push(g * 0.2);
        }
        return _results;
      }).call(this), this.eq_nodes[0].gain.value = _ref[0], this.eq_nodes[1].gain.value = _ref[1], this.eq_nodes[2].gain.value = _ref[2], _ref;
    };

    SampleNode.prototype.getEQParam = function() {
      return this.eq_gains;
    };

    SampleNode.prototype.setOutputParam = function(pan_value, gain) {
      this.pan_value = pan_value;
      this.panner.setPosition(this.pan_value);
      return this.out.gain.value = gain;
    };

    SampleNode.prototype.getOutputParam = function() {
      return [this.pan_value, this.out.gain.value];
    };

    SampleNode.prototype.getData = function() {
      return this.buffer;
    };

    SampleNode.prototype.getParam = function() {
      return {
        wave: this.name,
        time: this.getTimeParam(),
        gains: this.eq_gains,
        output: this.getOutputParam()
      };
    };

    SampleNode.prototype.readParam = function(p) {
      if (p.wave != null) {
        this.setSample(p.wave);
      }
      if (p.time != null) {
        this.setTimeParam(p.time[0], p.time[1], p.time[2]);
      }
      if (p.gains != null) {
        this.setEQParam(p.gains);
      }
      if (p.output != null) {
        return this.setOutputParam(p.output[0], p.output[1]);
      }
    };

    return SampleNode;

  })();

  this.SamplerCore = (function() {
    function SamplerCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 1.0;
      this.gain = 1.0;
      this.is_mute = false;
      this.samples = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 10; i = ++_i) {
          _results.push(new SampleNode(this.ctx, i, this));
        }
        return _results;
      }).call(this);
      for (i = _i = 0; _i < 10; i = ++_i) {
        this.samples[i].connect(this.node);
      }
      this.view = new SamplerCoreView(this, id, this.parent.view.dom.find('.sampler-core'));
    }

    SamplerCore.prototype.noteOn = function(notes) {
      var n, time, _i, _len, _results;
      if (this.is_mute) {
        return;
      }
      time = this.ctx.currentTime;
      if (Array.isArray(notes)) {
        _results = [];
        for (_i = 0, _len = notes.length; _i < _len; _i++) {
          n = notes[_i];
          _results.push(this.samples[n[0] - 1].noteOn(n[1], time));
        }
        return _results;
      }
    };

    SamplerCore.prototype.noteOff = function() {
      var t0;
      return t0 = this.ctx.currentTime;
    };

    SamplerCore.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    SamplerCore.prototype.setSample = function(i, name) {
      return this.samples[i].setSample(name);
    };

    SamplerCore.prototype.setSampleTimeParam = function(i, head, tail, speed) {
      return this.samples[i].setTimeParam(head, tail, speed);
    };

    SamplerCore.prototype.setSampleEQParam = function(i, lo, mid, hi) {
      return this.samples[i].setEQParam([lo, mid, hi]);
    };

    SamplerCore.prototype.setSampleOutputParam = function(i, pan, gain) {
      return this.samples[i].setOutputParam(pan, gain);
    };

    SamplerCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.node.gain.value = this.gain;
    };

    SamplerCore.prototype.getSampleTimeParam = function(i) {
      return this.samples[i].getTimeParam();
    };

    SamplerCore.prototype.getSampleData = function(i) {
      return this.samples[i].getData();
    };

    SamplerCore.prototype.getSampleEQParam = function(i) {
      return this.samples[i].getEQParam();
    };

    SamplerCore.prototype.getSampleOutputParam = function(i) {
      return this.samples[i].getOutputParam();
    };

    SamplerCore.prototype.sampleLoaded = function(id) {
      return this.view.updateWaveformCanvas(id);
    };

    SamplerCore.prototype.bindSample = function(sample_now) {
      this.view.bindSample(sample_now, this.samples[sample_now].getParam());
      this.view.readSampleTimeParam(this.getSampleTimeParam(sample_now));
      this.view.readSampleEQParam(this.getSampleEQParam(sample_now));
      return this.view.readSampleOutputParam(this.getSampleOutputParam(sample_now));
    };

    SamplerCore.prototype.getParam = function() {
      var s;
      return {
        type: 'SAMPLER',
        samples: (function() {
          var _i, _len, _ref, _results;
          _ref = this.samples;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(s.getParam());
          }
          return _results;
        }).call(this)
      };
    };

    SamplerCore.prototype.readParam = function(p) {
      var i, _i, _ref;
      if (p.samples != null) {
        for (i = _i = 0, _ref = p.samples.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.samples[i].readParam(p.samples[i]);
        }
      }
      return this.bindSample(0);
    };

    SamplerCore.prototype.mute = function() {
      return this.is_mute = true;
    };

    SamplerCore.prototype.demute = function() {
      return this.is_mute = false;
    };

    return SamplerCore;

  })();

  this.Sampler = (function() {
    function Sampler(ctx, id, player, name) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.name = name;
      this.type = 'SAMPLER';
      if (this.name == null) {
        this.name = 'Sampler #' + this.id;
      }
      this.pattern_name = 'pattern 0';
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      this.time = 0;
      this.view = new SamplerView(this, this.id);
      this.core = new SamplerCore(this, this.ctx, this.id);
      this.is_sustaining = false;
      this.session = this.player.session;
      this.send = this.ctx.createGain();
      this.send.gain.value = 1.0;
      this["return"] = this.ctx.createGain();
      this["return"].gain.value = 1.0;
      this.core.connect(this.send);
      this.send.connect(this["return"]);
      this.effects = [];
    }

    Sampler.prototype.connect = function(dst) {
      if (dst instanceof Panner) {
        return this["return"].connect(dst["in"]);
      } else {
        return this["return"].connect(dst);
      }
    };

    Sampler.prototype.setDuration = function() {};

    Sampler.prototype.setKey = function() {};

    Sampler.prototype.setScale = function() {};

    Sampler.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Sampler.prototype.setGain = function(gain) {
      return this.core.setGain(gain);
    };

    Sampler.prototype.getGain = function() {
      return this.core.gain;
    };

    Sampler.prototype.noteOn = function(note) {
      return this.core.noteOn([[note, 1.0]]);
    };

    Sampler.prototype.noteOff = function() {
      return this.core.noteOff();
    };

    Sampler.prototype.playAt = function(time) {
      var mytime, notes;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.pattern[mytime] !== 0) {
        notes = this.pattern[mytime];
        return this.core.noteOn(notes);
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

    Sampler.prototype.readPattern = function(_pattern_obj) {
      this.pattern_obj = $.extend(true, {}, _pattern_obj);
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.readPattern(this.pattern_obj);
    };

    Sampler.prototype.getPattern = function() {
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      return $.extend(true, {}, this.pattern_obj);
    };

    Sampler.prototype.clearPattern = function() {
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj.pattern = this.pattern;
      return this.view.readPattern(this.pattern_obj);
    };

    Sampler.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.addNote = function(time, note, gain) {
      var i, _i, _ref;
      if (!Array.isArray(this.pattern[time])) {
        this.pattern[time] = [[this.pattern[time], 1.0]];
      }
      for (i = _i = 0, _ref = this.pattern[time].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[time][i][0] === note) {
          this.pattern[time].splice(i, 1);
        }
      }
      return this.pattern[time].push([note, gain]);
    };

    Sampler.prototype.removeNote = function(pos) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          _results.push(this.pattern[pos.x_abs].splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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

    Sampler.prototype.setSynthName = function(name) {
      this.name = name;
      this.session.setSynthName(this.id, this.name);
      return this.view.setSynthName(this.name);
    };

    Sampler.prototype.setPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.session.setPatternName(this.id, this.pattern_name);
    };

    Sampler.prototype.readPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.view.setPatternName(this.pattern_name);
    };

    Sampler.prototype.selectSample = function(sample_now) {
      return this.core.bindSample(sample_now);
    };

    Sampler.prototype.replaceWith = function(s_new) {
      return this.view.dom.replaceWith(s_new.view.dom);
    };

    Sampler.prototype.getParam = function() {
      var p;
      p = this.core.getParam();
      p.name = this.name;
      p.effects = this.getEffectsParam();
      return p;
    };

    Sampler.prototype.readParam = function(p) {
      if (p != null) {
        return this.core.readParam(p);
      }
    };

    Sampler.prototype.mute = function() {
      return this.core.mute();
    };

    Sampler.prototype.demute = function() {
      return this.core.demute();
    };

    Sampler.prototype.getEffectsParam = function() {
      var f, _i, _len, _ref, _results;
      _ref = this.effects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f.getParam());
      }
      return _results;
    };

    Sampler.prototype.insertEffect = function(fx) {
      if (this.effects.length === 0) {
        this.send.disconnect();
        this.send.connect(fx["in"]);
      } else {
        this.effects[this.effects.length - 1].disconnect();
        this.effects[this.effects.length - 1].connect(fx["in"]);
      }
      fx.connect(this["return"]);
      fx.setSource(this);
      return this.effects.push(fx);
    };

    return Sampler;

  })();

  SAMPLES_DEFAULT = ['bd_909dwsd', 'bd_sub808', 'snr_drm909kit1', 'snr_mpc', 'clp_raw', 'clp_basics', 'hat_lilcloser', 'hat_nice909open', 'shaker_bot', 'tam_lifein2d'];

  this.SAMPLES = {
    'kick1': {
      url: 'static/wav/kick1.wav'
    },
    'kick2': {
      url: 'static/wav/kick2.wav'
    },
    'snare1': {
      url: 'static/wav/snare1.wav'
    },
    'snare2': {
      url: 'static/wav/snare2.wav'
    },
    'clap': {
      url: 'static/wav/clap.wav'
    },
    'hat_closed': {
      url: 'static/wav/hat_closed.wav'
    },
    'hat_open': {
      url: 'static/wav/hat_open.wav'
    },
    'ride': {
      url: 'static/wav/ride.wav'
    },
    'bd_909dwsd': {
      url: 'static/wav/deep_house/bd_kick/bd_909dwsd.wav'
    },
    'bd_chicago': {
      url: 'static/wav/deep_house/bd_kick/bd_chicago.wav'
    },
    'bd_dandans': {
      url: 'static/wav/deep_house/bd_kick/bd_dandans.wav'
    },
    'bd_deephouser': {
      url: 'static/wav/deep_house/bd_kick/bd_deephouser.wav'
    },
    'bd_diesel': {
      url: 'static/wav/deep_house/bd_kick/bd_diesel.wav'
    },
    'bd_dropped': {
      url: 'static/wav/deep_house/bd_kick/bd_dropped.wav'
    },
    'bd_flir': {
      url: 'static/wav/deep_house/bd_kick/bd_flir.wav'
    },
    'bd_gas': {
      url: 'static/wav/deep_house/bd_kick/bd_gas.wav'
    },
    'bd_ghost': {
      url: 'static/wav/deep_house/bd_kick/bd_ghost.wav'
    },
    'bd_hybrid': {
      url: 'static/wav/deep_house/bd_kick/bd_hybrid.wav'
    },
    'bd_isampleoldskool': {
      url: 'static/wav/deep_house/bd_kick/bd_isampleoldskool.wav'
    },
    'bd_liked': {
      url: 'static/wav/deep_house/bd_kick/bd_liked.wav'
    },
    'bd_mainroom': {
      url: 'static/wav/deep_house/bd_kick/bd_mainroom.wav'
    },
    'bd_mirror': {
      url: 'static/wav/deep_house/bd_kick/bd_mirror.wav'
    },
    'bd_nash': {
      url: 'static/wav/deep_house/bd_kick/bd_nash.wav'
    },
    'bd_newyear': {
      url: 'static/wav/deep_house/bd_kick/bd_newyear.wav'
    },
    'bd_organicisin': {
      url: 'static/wav/deep_house/bd_kick/bd_organicisin.wav'
    },
    'bd_outdoor': {
      url: 'static/wav/deep_house/bd_kick/bd_outdoor.wav'
    },
    'bd_shoein': {
      url: 'static/wav/deep_house/bd_kick/bd_shoein.wav'
    },
    'bd_sodeep': {
      url: 'static/wav/deep_house/bd_kick/bd_sodeep.wav'
    },
    'bd_sonikboom': {
      url: 'static/wav/deep_house/bd_kick/bd_sonikboom.wav'
    },
    'bd_streek': {
      url: 'static/wav/deep_house/bd_kick/bd_streek.wav'
    },
    'bd_stripped': {
      url: 'static/wav/deep_house/bd_kick/bd_stripped.wav'
    },
    'bd_sub808': {
      url: 'static/wav/deep_house/bd_kick/bd_sub808.wav'
    },
    'bd_tech': {
      url: 'static/wav/deep_house/bd_kick/bd_tech.wav'
    },
    'bd_tripper': {
      url: 'static/wav/deep_house/bd_kick/bd_tripper.wav'
    },
    'bd_uma': {
      url: 'static/wav/deep_house/bd_kick/bd_uma.wav'
    },
    'bd_untitled': {
      url: 'static/wav/deep_house/bd_kick/bd_untitled.wav'
    },
    'bd_vintager': {
      url: 'static/wav/deep_house/bd_kick/bd_vintager.wav'
    },
    'bd_vinylinstereo': {
      url: 'static/wav/deep_house/bd_kick/bd_vinylinstereo.wav'
    },
    'snr_analogging': {
      url: 'static/wav/deep_house/snare/snr_analogging.wav'
    },
    'snr_answer8bit': {
      url: 'static/wav/deep_house/snare/snr_answer8bit.wav'
    },
    'snr_bland': {
      url: 'static/wav/deep_house/snare/snr_bland.wav'
    },
    'snr_drm909kit': {
      url: 'static/wav/deep_house/snare/snr_drm909kit.wav'
    },
    'snr_dwreal': {
      url: 'static/wav/deep_house/snare/snr_dwreal.wav'
    },
    'snr_housey': {
      url: 'static/wav/deep_house/snare/snr_housey.wav'
    },
    'snr_mpc': {
      url: 'static/wav/deep_house/snare/snr_mpc.wav'
    },
    'snr_myclassicsnare': {
      url: 'static/wav/deep_house/snare/snr_myclassicsnare.wav'
    },
    'snr_owned': {
      url: 'static/wav/deep_house/snare/snr_owned.wav'
    },
    'snr_royalty': {
      url: 'static/wav/deep_house/snare/snr_royalty.wav'
    },
    'snr_rusnarious': {
      url: 'static/wav/deep_house/snare/snr_rusnarious.wav'
    },
    'snr_truevintage': {
      url: 'static/wav/deep_house/snare/snr_truevintage.wav'
    },
    'clp_analogue': {
      url: 'static/wav/deep_house/clap/clp_analogue.wav'
    },
    'clp_applause': {
      url: 'static/wav/deep_house/clap/clp_applause.wav'
    },
    'clp_basics': {
      url: 'static/wav/deep_house/clap/clp_basics.wav'
    },
    'clp_can': {
      url: 'static/wav/deep_house/clap/clp_can.wav'
    },
    'clp_clap10000': {
      url: 'static/wav/deep_house/clap/clp_clap10000.wav'
    },
    'clp_classic': {
      url: 'static/wav/deep_house/clap/clp_classic.wav'
    },
    'clp_clipper': {
      url: 'static/wav/deep_house/clap/clp_clipper.wav'
    },
    'clp_delma': {
      url: 'static/wav/deep_house/clap/clp_delma.wav'
    },
    'clp_donuts': {
      url: 'static/wav/deep_house/clap/clp_donuts.wav'
    },
    'clp_drastik': {
      url: 'static/wav/deep_house/clap/clp_drastik.wav'
    },
    'clp_eternity': {
      url: 'static/wav/deep_house/clap/clp_eternity.wav'
    },
    'clp_happiness': {
      url: 'static/wav/deep_house/clap/clp_happiness.wav'
    },
    'clp_kiddo': {
      url: 'static/wav/deep_house/clap/clp_kiddo.wav'
    },
    'clp_knowledge': {
      url: 'static/wav/deep_house/clap/clp_knowledge.wav'
    },
    'clp_kournikova': {
      url: 'static/wav/deep_house/clap/clp_kournikova.wav'
    },
    'clp_raw': {
      url: 'static/wav/deep_house/clap/clp_raw.wav'
    },
    'clp_scorch': {
      url: 'static/wav/deep_house/clap/clp_scorch.wav'
    },
    'clp_socute': {
      url: 'static/wav/deep_house/clap/clp_socute.wav'
    },
    'clp_sustained': {
      url: 'static/wav/deep_house/clap/clp_sustained.wav'
    },
    'clp_tayo': {
      url: 'static/wav/deep_house/clap/clp_tayo.wav'
    },
    'clp_tense': {
      url: 'static/wav/deep_house/clap/clp_tense.wav'
    },
    'clp_thinlayer': {
      url: 'static/wav/deep_house/clap/clp_thinlayer.wav'
    },
    'clp_verona': {
      url: 'static/wav/deep_house/clap/clp_verona.wav'
    },
    'hat_626': {
      url: 'static/wav/deep_house/hats/hat_626.wav'
    },
    'hat_ace': {
      url: 'static/wav/deep_house/hats/hat_ace.wav'
    },
    'hat_addverb': {
      url: 'static/wav/deep_house/hats/hat_addverb.wav'
    },
    'hat_analog': {
      url: 'static/wav/deep_house/hats/hat_analog.wav'
    },
    'hat_bebias': {
      url: 'static/wav/deep_house/hats/hat_bebias.wav'
    },
    'hat_bestfriend': {
      url: 'static/wav/deep_house/hats/hat_bestfriend.wav'
    },
    'hat_bigdeal': {
      url: 'static/wav/deep_house/hats/hat_bigdeal.wav'
    },
    'hat_blackmamba': {
      url: 'static/wav/deep_house/hats/hat_blackmamba.wav'
    },
    'hat_chart': {
      url: 'static/wav/deep_house/hats/hat_chart.wav'
    },
    'hat_charter': {
      url: 'static/wav/deep_house/hats/hat_charter.wav'
    },
    'hat_chipitaka': {
      url: 'static/wav/deep_house/hats/hat_chipitaka.wav'
    },
    'hat_classical': {
      url: 'static/wav/deep_house/hats/hat_classical.wav'
    },
    'hat_classichousehat': {
      url: 'static/wav/deep_house/hats/hat_classichousehat.wav'
    },
    'hat_closer': {
      url: 'static/wav/deep_house/hats/hat_closer.wav'
    },
    'hat_collective': {
      url: 'static/wav/deep_house/hats/hat_collective.wav'
    },
    'hat_crackers': {
      url: 'static/wav/deep_house/hats/hat_crackers.wav'
    },
    'hat_critters': {
      url: 'static/wav/deep_house/hats/hat_critters.wav'
    },
    'hat_cuppa': {
      url: 'static/wav/deep_house/hats/hat_cuppa.wav'
    },
    'hat_darkstar': {
      url: 'static/wav/deep_house/hats/hat_darkstar.wav'
    },
    'hat_deephouseopen': {
      url: 'static/wav/deep_house/hats/hat_deephouseopen.wav'
    },
    'hat_drawn': {
      url: 'static/wav/deep_house/hats/hat_drawn.wav'
    },
    'hat_freekn': {
      url: 'static/wav/deep_house/hats/hat_freekn.wav'
    },
    'hat_gater': {
      url: 'static/wav/deep_house/hats/hat_gater.wav'
    },
    'hat_glitchbitch': {
      url: 'static/wav/deep_house/hats/hat_glitchbitch.wav'
    },
    'hat_hatgasm': {
      url: 'static/wav/deep_house/hats/hat_hatgasm.wav'
    },
    'hat_hattool': {
      url: 'static/wav/deep_house/hats/hat_hattool.wav'
    },
    'hat_jelly': {
      url: 'static/wav/deep_house/hats/hat_jelly.wav'
    },
    'hat_kate': {
      url: 'static/wav/deep_house/hats/hat_kate.wav'
    },
    'hat_lights': {
      url: 'static/wav/deep_house/hats/hat_lights.wav'
    },
    'hat_lilcloser': {
      url: 'static/wav/deep_house/hats/hat_lilcloser.wav'
    },
    'hat_mydustyhouse': {
      url: 'static/wav/deep_house/hats/hat_mydustyhouse.wav'
    },
    'hat_myfavouriteopen': {
      url: 'static/wav/deep_house/hats/hat_myfavouriteopen.wav'
    },
    'hat_negative6': {
      url: 'static/wav/deep_house/hats/hat_negative6.wav'
    },
    'hat_nice909open': {
      url: 'static/wav/deep_house/hats/hat_nice909open.wav'
    },
    'hat_niner0niner': {
      url: 'static/wav/deep_house/hats/hat_niner0niner.wav'
    },
    'hat_omgopen': {
      url: 'static/wav/deep_house/hats/hat_omgopen.wav'
    },
    'hat_openiner': {
      url: 'static/wav/deep_house/hats/hat_openiner.wav'
    },
    'hat_original': {
      url: 'static/wav/deep_house/hats/hat_original.wav'
    },
    'hat_quentin': {
      url: 'static/wav/deep_house/hats/hat_quentin.wav'
    },
    'hat_rawsample': {
      url: 'static/wav/deep_house/hats/hat_rawsample.wav'
    },
    'hat_retired': {
      url: 'static/wav/deep_house/hats/hat_retired.wav'
    },
    'hat_sampleking': {
      url: 'static/wav/deep_house/hats/hat_sampleking.wav'
    },
    'hat_samplekingdom': {
      url: 'static/wav/deep_house/hats/hat_samplekingdom.wav'
    },
    'hat_sharp': {
      url: 'static/wav/deep_house/hats/hat_sharp.wav'
    },
    'hat_soff': {
      url: 'static/wav/deep_house/hats/hat_soff.wav'
    },
    'hat_spreadertrick': {
      url: 'static/wav/deep_house/hats/hat_spreadertrick.wav'
    },
    'hat_stereosonic': {
      url: 'static/wav/deep_house/hats/hat_stereosonic.wav'
    },
    'hat_tameit': {
      url: 'static/wav/deep_house/hats/hat_tameit.wav'
    },
    'hat_vintagespread': {
      url: 'static/wav/deep_house/hats/hat_vintagespread.wav'
    },
    'hat_void': {
      url: 'static/wav/deep_house/hats/hat_void.wav'
    },
    'shaker_bot': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_bot.wav'
    },
    'shaker_broom': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_broom.wav'
    },
    'shaker_command': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_command.wav'
    },
    'shaker_halfshake': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_halfshake.wav'
    },
    'shaker_pause': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_pause.wav'
    },
    'shaker_quicky': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_quicky.wav'
    },
    'shaker_really': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_really.wav'
    },
    'tam_christmassy': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_christmassy.wav'
    },
    'tam_extras': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_extras.wav'
    },
    'tam_hohoho': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_hohoho.wav'
    },
    'tam_lifein2d': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_lifein2d.wav'
    },
    'tam_mrhat': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_mrhat.wav'
    },
    'tom_909fatty': {
      url: 'static/wav/deep_house/toms/tom_909fatty.wav'
    },
    'tom_909onvinyl': {
      url: 'static/wav/deep_house/toms/tom_909onvinyl.wav'
    },
    'tom_cleansweep': {
      url: 'static/wav/deep_house/toms/tom_cleansweep.wav'
    },
    'tom_dept': {
      url: 'static/wav/deep_house/toms/tom_dept.wav'
    },
    'tom_discodisco': {
      url: 'static/wav/deep_house/toms/tom_discodisco.wav'
    },
    'tom_eclipse': {
      url: 'static/wav/deep_house/toms/tom_eclipse.wav'
    },
    'tom_enriched': {
      url: 'static/wav/deep_house/toms/tom_enriched.wav'
    },
    'tom_enrico': {
      url: 'static/wav/deep_house/toms/tom_enrico.wav'
    },
    'tom_greatwhite': {
      url: 'static/wav/deep_house/toms/tom_greatwhite.wav'
    },
    'tom_iloveroland': {
      url: 'static/wav/deep_house/toms/tom_iloveroland.wav'
    },
    'tom_madisonave': {
      url: 'static/wav/deep_house/toms/tom_madisonave.wav'
    },
    'tom_ofalltoms': {
      url: 'static/wav/deep_house/toms/tom_ofalltoms.wav'
    },
    'tom_summerdayze': {
      url: 'static/wav/deep_house/toms/tom_summerdayze.wav'
    },
    'tom_taste': {
      url: 'static/wav/deep_house/toms/tom_taste.wav'
    },
    'tom_vsneve': {
      url: 'static/wav/deep_house/toms/tom_vsneve.wav'
    },
    'prc_808rimmer': {
      url: 'static/wav/deep_house/percussion/prc_808rimmer.wav'
    },
    'prc_bigdrum': {
      url: 'static/wav/deep_house/percussion/prc_bigdrum.wav'
    },
    'prc_bongodrm': {
      url: 'static/wav/deep_house/percussion/prc_bongodrm.wav'
    },
    'prc_bongorock': {
      url: 'static/wav/deep_house/percussion/prc_bongorock.wav'
    },
    'prc_boxed': {
      url: 'static/wav/deep_house/percussion/prc_boxed.wav'
    },
    'prc_change': {
      url: 'static/wav/deep_house/percussion/prc_change.wav'
    },
    'prc_clav': {
      url: 'static/wav/deep_house/percussion/prc_clav.wav'
    },
    'prc_congaz': {
      url: 'static/wav/deep_house/percussion/prc_congaz.wav'
    },
    'prc_dnthavacowman': {
      url: 'static/wav/deep_house/percussion/prc_dnthavacowman.wav'
    },
    'prc_drop': {
      url: 'static/wav/deep_house/percussion/prc_drop.wav'
    },
    'prc_emtythepot': {
      url: 'static/wav/deep_house/percussion/prc_emtythepot.wav'
    },
    'prc_flickingabucket': {
      url: 'static/wav/deep_house/percussion/prc_flickingabucket.wav'
    },
    'prc_foryoursampler': {
      url: 'static/wav/deep_house/percussion/prc_foryoursampler.wav'
    },
    'prc_harmony': {
      url: 'static/wav/deep_house/percussion/prc_harmony.wav'
    },
    'prc_hit': {
      url: 'static/wav/deep_house/percussion/prc_hit.wav'
    },
    'prc_home': {
      url: 'static/wav/deep_house/percussion/prc_home.wav'
    },
    'prc_itgoespop': {
      url: 'static/wav/deep_house/percussion/prc_itgoespop.wav'
    },
    'prc_jungledrummer': {
      url: 'static/wav/deep_house/percussion/prc_jungledrummer.wav'
    },
    'prc_knockknock': {
      url: 'static/wav/deep_house/percussion/prc_knockknock.wav'
    },
    'prc_reworked': {
      url: 'static/wav/deep_house/percussion/prc_reworked.wav'
    },
    'prc_rolled': {
      url: 'static/wav/deep_house/percussion/prc_rolled.wav'
    },
    'prc_syntheticlav': {
      url: 'static/wav/deep_house/percussion/prc_syntheticlav.wav'
    },
    'prc_trainstation': {
      url: 'static/wav/deep_house/percussion/prc_trainstation.wav'
    },
    'prc_u5510n': {
      url: 'static/wav/deep_house/percussion/prc_u5510n.wav'
    },
    'prc_vinylshot': {
      url: 'static/wav/deep_house/percussion/prc_vinylshot.wav'
    },
    'prc_virustiatmos': {
      url: 'static/wav/deep_house/percussion/prc_virustiatmos.wav'
    },
    'prc_youpanit': {
      url: 'static/wav/deep_house/percussion/prc_youpanit.wav'
    },
    'cym_crashtest': {
      url: 'static/wav/deep_house/ride_cymbal/cym_crashtest.wav'
    },
    'cym_gatecrashed': {
      url: 'static/wav/deep_house/ride_cymbal/cym_gatecrashed.wav'
    },
    'ride_8bitdirty': {
      url: 'static/wav/deep_house/ride_cymbal/ride_8bitdirty.wav'
    },
    'ride_cymbal1': {
      url: 'static/wav/deep_house/ride_cymbal/ride_cymbal1.wav'
    },
    'ride_full': {
      url: 'static/wav/deep_house/ride_cymbal/ride_full.wav'
    },
    'ride_jules': {
      url: 'static/wav/deep_house/ride_cymbal/ride_jules.wav'
    },
    'ride_mpc60': {
      url: 'static/wav/deep_house/ride_cymbal/ride_mpc60.wav'
    }
  };

}).call(this);
