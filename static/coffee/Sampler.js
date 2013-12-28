(function() {
  this.SAMPLES = [
    {
      name: 'kick1',
      url: 'static/wav/kick1.wav'
    }, {
      name: 'kick1',
      url: 'static/wav/kick1.wav'
    }, {
      name: 'kick1',
      url: 'static/wav/kick1.wav'
    }, {
      name: 'kick2',
      url: 'static/wav/kick2.wav'
    }, {
      name: 'snare1',
      url: 'static/wav/snare1.wav'
    }, {
      name: 'snare2',
      url: 'static/wav/snare2.wav'
    }, {
      name: 'clap',
      url: 'static/wav/clap.wav'
    }, {
      name: 'hat_closed',
      url: 'static/wav/hat_closed.wav'
    }, {
      name: 'hat_open',
      url: 'static/wav/hat_open.wav'
    }, {
      name: 'ride',
      url: 'static/wav/ride.wav'
    }, {
      name: 'ride',
      url: 'static/wav/ride.wav'
    }
  ];

  this.BufferNode = (function() {
    function BufferNode(ctx, id, parent) {
      var eq1, eq2, eq3, sample, _ref, _ref1, _ref2, _ref3, _ref4;
      this.ctx = ctx;
      this.id = id;
      this.parent = parent;
      this.node = this.ctx.createGain();
      this.node.gain.value = 1.0;
      sample = window.SAMPLES[this.id];
      this.setSample(sample);
      this.head = 0.0;
      this.tail = 1.0;
      this.speed = 1.0;
      this.eq_gains = [0.0, 0.0, 0.0];
      _ref = [this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter()], eq1 = _ref[0], eq2 = _ref[1], eq3 = _ref[2];
      _ref1 = ['lowshelf', 'peaking', 'highshelf'], eq1.type = _ref1[0], eq2.type = _ref1[1], eq3.type = _ref1[2];
      _ref2 = [0.6, 0.6, 0.6], eq1.Q.value = _ref2[0], eq2.Q.value = _ref2[1], eq3.Q.value = _ref2[2];
      _ref3 = [350, 2000, 4000], eq1.frequency.value = _ref3[0], eq2.frequency.value = _ref3[1], eq3.frequency.value = _ref3[2];
      _ref4 = this.eq_gains, eq1.gain.value = _ref4[0], eq2.gain.value = _ref4[1], eq3.gain.value = _ref4[2];
      this.eq_nodes = [eq1, eq2, eq3];
      this.panner = this.ctx.createPanner();
      this.panner.panningModel = "equalpower";
      this.pan_value = [0, 0, -1];
      eq1.connect(eq2);
      eq2.connect(eq3);
      eq3.connect(this.panner);
      this.panner.connect(this.node);
    }

    BufferNode.prototype.setSample = function(sample) {
      var req,
        _this = this;
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

    BufferNode.prototype.connect = function(dst) {
      this.dst = dst;
      return this.node.connect(this.dst);
    };

    BufferNode.prototype.noteOn = function(gain, time) {
      var head_time, node, source, tail_time;
      if (this.buffer == null) {
        return;
      }
      source = this.ctx.createBufferSource();
      source.buffer = this.buffer;
      node = this.ctx.createGain();
      source.connect(node);
      node.connect(this.eq_nodes[0]);
      head_time = time + this.buffer_duration * this.head;
      tail_time = time + this.buffer_duration * this.tail;
      source.start(0);
      node.gain.setValueAtTime(0, time);
      node.gain.linearRampToValueAtTime(gain, head_time + 0.001);
      node.gain.setValueAtTime(gain, tail_time);
      return node.gain.linearRampToValueAtTime(0, tail_time + 0.001);
    };

    BufferNode.prototype.setParam = function(head, tail, speed) {
      this.head = head;
      this.tail = tail;
      this.speed = speed;
    };

    BufferNode.prototype.getParam = function() {
      return [this.head, this.tail, this.speed];
    };

    BufferNode.prototype.setEQParam = function(eq_gains) {
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

    BufferNode.prototype.getEQParam = function() {
      return this.eq_gains;
    };

    BufferNode.prototype.setOutputParam = function(pan_value, gain) {
      this.pan_value = pan_value;
      this.panner.setPosition(this.pan_value[0], this.pan_value[1], this.pan_value[2]);
      return this.node.gain.value = gain;
    };

    BufferNode.prototype.getOutputParam = function() {
      return [this.pan_value, this.node.gain.value];
    };

    BufferNode.prototype.getData = function() {
      return this.buffer;
    };

    return BufferNode;

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
      this.node.gain.value = 1.0;
      this.gain = 1.0;
      this.nodes = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 10; i = ++_i) {
          _results.push(new BufferNode(this.ctx, i, this));
        }
        return _results;
      }).call(this);
      for (i = _i = 0; _i < 10; i = ++_i) {
        this.nodes[i].connect(this.node);
      }
      this.view = new SamplerCoreView(this, id, this.parent.view.dom.find('.sampler-core'));
    }

    SamplerCore.prototype.noteOn = function(notes) {
      var n, time, _i, _len, _results;
      time = this.ctx.currentTime;
      if (Array.isArray(notes)) {
        _results = [];
        for (_i = 0, _len = notes.length; _i < _len; _i++) {
          n = notes[_i];
          _results.push(this.nodes[n[0] - 1].noteOn(n[1], time));
        }
        return _results;
      } else {
        return this.nodes[notes - 1].noteOn(1, time);
      }
    };

    SamplerCore.prototype.noteOff = function() {
      var t0;
      return t0 = this.ctx.currentTime;
    };

    SamplerCore.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    SamplerCore.prototype.setSampleParam = function(i, head, tail, speed) {
      return this.nodes[i].setParam(head, tail, speed);
    };

    SamplerCore.prototype.setSampleEQParam = function(i, lo, mid, hi) {
      return this.nodes[i].setEQParam([lo, mid, hi]);
    };

    SamplerCore.prototype.setSampleOutputParam = function(i, pan, gain) {
      return this.nodes[i].setOutputParam(pan, gain);
    };

    SamplerCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.node.gain.value = this.gain;
    };

    SamplerCore.prototype.getSampleParam = function(i) {
      return this.nodes[i].getParam();
    };

    SamplerCore.prototype.getSampleData = function(i) {
      return this.nodes[i].getData();
    };

    SamplerCore.prototype.getSampleEQParam = function(i) {
      return this.nodes[i].getEQParam();
    };

    SamplerCore.prototype.getSampleOutputParam = function(i) {
      return this.nodes[i].getOutputParam();
    };

    SamplerCore.prototype.sampleLoaded = function(id) {
      return this.view.updateWaveformCanvas(id);
    };

    SamplerCore.prototype.bindSample = function(sample_now) {
      this.view.updateWaveformCanvas(sample_now);
      this.view.updateEQCanvas();
      this.view.readSampleParam(this.getSampleParam(sample_now));
      this.view.readSampleEQParam(this.getSampleEQParam(sample_now));
      return this.view.readSampleOutputParam(this.getSampleOutputParam(sample_now));
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
    }

    Sampler.prototype.connect = function(dst) {
      return this.core.connect(dst);
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

    Sampler.prototype.readPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.readPattern(this.pattern_obj);
    };

    Sampler.prototype.clearPattern = function() {
      this.pattern = this.pattern.concat([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
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

    Sampler.prototype.selectSample = function(sample_now) {
      return this.core.bindSample(sample_now);
    };

    Sampler.prototype.replaceWith = function(s_new) {
      return this.view.dom.replaceWith(s_new.view.dom);
    };

    return Sampler;

  })();

}).call(this);
