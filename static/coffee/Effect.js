(function() {
  var IR_LOADED, IR_URL,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FX = (function() {
    function FX(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createGain();
      this["in"].gain.value = 1.0;
      this.out = this.ctx.createGain();
      this.out.gain.value = 1.0;
      this.view = new FXView(this);
    }

    FX.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    FX.prototype.disconnect = function() {
      return this.out.disconnect();
    };

    FX.prototype.setInput = function(d) {
      return this["in"].gain.value = d;
    };

    FX.prototype.setOutput = function(d) {
      return this.out.gain.value = d;
    };

    FX.prototype.appendTo = function(dst) {
      return $(dst).append(this.view.dom);
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
      this.lofi = this.ctx.createBiquadFilter();
      this.lofi.frequency.value = 1200;
      this.lofi.Q.value = 0.0;
      this.lofi.gain.value = 1.0;
      this.feedback = this.ctx.createGain();
      this.feedback.gain.value = 0.4;
      this["in"].connect(this.lofi);
      this.lofi.connect(this.delay);
      this.delay.connect(this.out);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.lofi);
      this.view = new DelayView(this);
    }

    Delay.prototype.setDelay = function(d) {
      return this.delay.delayTime.value = d;
    };

    Delay.prototype.setFeedback = function(d) {
      return this.feedback.gain.value = d;
    };

    Delay.prototype.setLofi = function(d) {
      return this.lofi.Q.value = d * 5.0;
    };

    Delay.prototype.setParam = function(p) {
      if (p.delay != null) {
        this.setDelay(p.delay);
      }
      if (p.feedback != null) {
        this.setFeedback(p.feedback);
      }
      if (p.lofi != null) {
        this.setLofi(p.lofi);
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

  this.Reverb = (function(_super) {
    __extends(Reverb, _super);

    function Reverb(ctx) {
      this.ctx = ctx;
      Reverb.__super__.constructor.call(this, this.ctx);
      this.reverb = this.ctx.createConvolver();
      this["in"].connect(this.reverb);
      this.reverb.connect(this.out);
      this.setIR('BIG_SNARE');
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
      this.view = new ReverbView(this);
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

  this.Compressor = (function(_super) {
    __extends(Compressor, _super);

    function Compressor(ctx) {
      this.ctx = ctx;
      Compressor.__super__.constructor.call(this, this.ctx);
      this.comp = this.ctx.createDynamicsCompressor();
      this["in"].connect(this.comp);
      this.comp.connect(this.out);
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
      this.view = new CompressorView(this);
    }

    Compressor.prototype.setAttack = function(d) {
      return this.comp.attack.value = d;
    };

    Compressor.prototype.setRelease = function(d) {
      return this.comp.release.value = d;
    };

    Compressor.prototype.setThreshold = function(d) {
      return this.comp.threshold.value = d;
    };

    Compressor.prototype.setRatio = function(d) {
      return this.comp.ratio.value = d;
    };

    Compressor.prototype.setKnee = function(d) {
      return this.comp.knee.value = d;
    };

    Compressor.prototype.setParam = function(p) {
      if (p.attack != null) {
        this.setAttack(p.attack);
      }
      if (p.release != null) {
        this.setRelease(p.release);
      }
      if (p.threshold != null) {
        this.setThreshold(p.threshold);
      }
      if (p.ratio != null) {
        this.setRatio(p.ratio);
      }
      if (p.knee != null) {
        this.setKnee(p.knee);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        return this.setOutput(p.output);
      }
    };

    return Compressor;

  })(this.FX);

  this.Limiter = (function() {
    function Limiter(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createDynamicsCompressor();
      this.out = this.ctx.createDynamicsCompressor();
      this["in"].connect(this.out);
      this["in"].threshold.value = -6;
      this.out.threshold.value = -10;
      this.out.ratio.value = 20;
    }

    Limiter.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    return Limiter;

  })();

  this.Fuzz = (function(_super) {
    __extends(Fuzz, _super);

    function Fuzz(ctx) {
      this.ctx = ctx;
      Fuzz.__super__.constructor.call(this, this.ctx);
      this.fuzz = this.ctx.createWaveShaper();
      this["in"].connect(this.fuzz);
      this.fuzz.connect(this.out);
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
      this.type = 'Sigmoid';
      this.samples = 2048;
      this.fuzz.curve = new Float32Array(this.samples);
      this.setGain(1.0);
      this.view = new FuzzView(this);
    }

    Fuzz.prototype.setType = function(d) {};

    Fuzz.prototype.setGain = function(d) {
      var i, ratio, sigmax, sigmoid, x, _i, _j, _ref, _ref1, _results, _results1;
      sigmax = 2.0 / (1 + Math.exp(-d * 1.0)) - 1.0;
      ratio = 1.0 / sigmax;
      if (this.type === 'Sigmoid') {
        _results = [];
        for (i = _i = 0, _ref = this.samples; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          x = i * 2.0 / this.samples - 1.0;
          sigmoid = 2.0 / (1 + Math.exp(-d * 100 * x)) - 1.0;
          _results.push(this.fuzz.curve[i] = sigmoid * ratio);
        }
        return _results;
      } else if (this.type === 'Octavia') {
        _results1 = [];
        for (i = _j = 0, _ref1 = this.samples; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          x = i * 2.0 / this.samples - 1.0;
          _results1.push(this.fuzz.curve[i] = Math.abs(x) * 2.0 - 1.0);
        }
        return _results1;
      }
    };

    Fuzz.prototype.setParam = function(p) {
      if (p.type != null) {
        this.setType(p.type);
      }
      if (p.gain != null) {
        this.setGain(p.gain);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        return this.setOutput(p.output);
      }
    };

    return Fuzz;

  })(this.FX);

  IR_URL = {
    'BIG_SNARE': 'static/IR/H3000/206_BIG_SNARE.wav',
    'Sweep_Reverb': 'static/IR/H3000/106_Sweep_Reverb.wav',
    'Reverb_Factory': 'static/IR/H3000/107_Reverb_Factory.wav',
    'Dense_Room': 'static/IR/H3000/114_Dense_Room.wav',
    '8_SEC_REVERB': 'static/IR/H3000/154_8_SEC_REVERB.wav',
    'GUITAR_ROOM': 'static/IR/H3000/178_GUITAR_ROOM.wav',
    'HUNTER_DELAY': 'static/IR/H3000/181_HUNTER_DELAY.wav',
    'JERRY_RACE_CAR': 'static/IR/H3000/182_JERRY_RACE_CAR.wav',
    'ResoVibroEee': 'static/IR/H3000/192_ResoVibroEee.wav',
    'ROOM_OF_DOOM': 'static/IR/H3000/193_ROOM_OF_DOOM.wav',
    'RHYTHM_&_REVERB': 'static/IR/H3000/194_RHYTHM_&_REVERB.wav',
    'BIG_SNARE': 'static/IR/H3000/206_BIG_SNARE.wav',
    'BIG_SWEEP': 'static/IR/H3000/207_BIG_SWEEP.wav',
    'BRIGHT_ROOM': 'static/IR/H3000/209_BRIGHT_ROOM.wav',
    'CANYON': 'static/IR/H3000/211_CANYON.wav',
    'DARK_ROOM': 'static/IR/H3000/213_DARK_ROOM.wav',
    'DISCRETE-VERB': 'static/IR/H3000/215_DISCRETE-VERB.wav',
    "EXPLODING_'VERB": "static/IR/H3000/219_EXPLODING_'VERB.wav",
    'GATED_REVERB': 'static/IR/H3000/223_GATED_REVERB.wav',
    'LOCKER_ROOM': 'static/IR/H3000/230_LOCKER_ROOM.wav',
    'RANDOM_GATE': 'static/IR/H3000/240_RANDOM_GATE.wav',
    'REVERSE_GATE': 'static/IR/H3000/241_REVERSE_GATE.wav',
    'RICH_PLATE': 'static/IR/H3000/243_RICH_PLATE.wav',
    'SHIMMERISH': 'static/IR/H3000/246_SHIMMERISH.wav',
    'SMALL_ROOM': 'static/IR/H3000/248_SMALL_ROOM.wav',
    'TONAL_ROOM': 'static/IR/H3000/254_TONAL_ROOM.wav',
    'WARM_HALL': 'static/IR/H3000/257_WARM_HALL.wav',
    'THRAX-VERB': 'static/IR/H3000/261_THRAX-VERB.wav',
    'TWIRLING_ROOM': 'static/IR/H3000/262_TWIRLING_ROOM.wav',
    'USEFUL_VERB': 'static/IR/H3000/265_USEFUL_VERB.wav',
    'FLUTTEROUS_ROOM': 'static/IR/H3000/278_FLUTTEROUS_ROOM.wav',
    'MARKS_MED_DARK': 'static/IR/H3000/282_MARKS_MED_DARK.wav',
    'LG_GUITAR_ROOM': 'static/IR/H3000/283_LG_GUITAR_ROOM.wav',
    'ACCURATE_ROOM': 'static/IR/H3000/368_ACCURATE_ROOM.wav',
    'BASS_SPACE': 'static/IR/H3000/371_BASS_SPACE.wav',
    'BriteBrassPlate': 'static/IR/H3000/372_BriteBrassPlate.wav',
    'CLOSE_MIKED': 'static/IR/H3000/377_CLOSE_MIKED.wav',
    'COMB_SPACE_1': 'static/IR/H3000/378_COMB_SPACE_1.wav',
    'COMPRESSED_AIR': 'static/IR/H3000/379_COMPRESSED_AIR.wav',
    'DOUBLE_SPACE_DENSE_ROOM': 'static/IR/H3000/381_DOUBLE_SPACE_DENSE_ROOM.wav',
    'DENSE_HALL_2': 'static/IR/H3000/382_DENSE_HALL_2.wav',
    'DELAY_W__ROOM': 'static/IR/H3000/383_DELAY_W__ROOM.wav',
    'DRAGON_BREATH': 'static/IR/H3000/385_DRAGON_BREATH.wav',
    'DRUM_AMBIENCE': 'static/IR/H3000/387_DRUM_AMBIENCE.wav',
    'GATED_FENCE': 'static/IR/H3000/390_GATED_FENCE.wav',
    'GATED_ROOM_2': 'static/IR/H3000/391_GATED_ROOM_2.wav',
    'GENERIC_HALL': 'static/IR/H3000/392_GENERIC_HALL.wav',
    'GREAT_DRUMSPACE': 'static/IR/H3000/393_GREAT_DRUMSPACE.wav',
    '5SEC_HANG_VERB': 'static/IR/H3000/394_5SEC_HANG_VERB.wav',
    'HUGE_DENSE_HALL': 'static/IR/H3000/395_HUGE_DENSE_HALL.wav',
    'HUGE_SYNTHSPACE': 'static/IR/H3000/396_HUGE_SYNTHSPACE.wav',
    'MANY_REFLECTIONS': 'static/IR/H3000/516_MANY_REFLECTIONS.wav',
    'AMBIENCE': 'static/IR/H3000/555_AMBIENCE.wav',
    'AMBIENT_BOOTH': 'static/IR/H3000/556_AMBIENT_BOOTH.wav',
    'BATHROOM': 'static/IR/H3000/557_BATHROOM.wav',
    'CRASS_ROOM': 'static/IR/H3000/559_CRASS_ROOM.wav',
    "DREW'S_CHAMBER": "static/IR/H3000/561_DREW'S_CHAMBER.wav",
    'DRUM_AMBIENCE': 'static/IR/H3000/562_DRUM_AMBIENCE.wav',
    'EMPTY_CLOSET': 'static/IR/H3000/563_EMPTY_CLOSET.wav',
    'EMPTY_ROOM': 'static/IR/H3000/564_EMPTY_ROOM.wav',
    'MEDIUM_SPACE': 'static/IR/H3000/565_MEDIUM_SPACE.wav',
    'NEW_HOUSE': 'static/IR/H3000/566_NEW_HOUSE.wav',
    'PRCSVHORN_PLATE': 'static/IR/H3000/567_PRCSVHORN_PLATE.wav',
    'REAL_ROOM': 'static/IR/H3000/568_REAL_ROOM.wav',
    'SMALL_ROOM': 'static/IR/H3000/569_SMALL_ROOM.wav',
    'SMLSTEREOSPACE': 'static/IR/H3000/570_SMLSTEREOSPACE.wav',
    'SMALLVOCAL_ROOM': 'static/IR/H3000/571_SMALLVOCAL_ROOM.wav',
    'TIGHT_ROOM': 'static/IR/H3000/572_TIGHT_ROOM.wav',
    'TIGHT_&_BRIGHT': 'static/IR/H3000/573_TIGHT_&_BRIGHT.wav',
    'VOCAL_BOOTH': 'static/IR/H3000/574_VOCAL_BOOTH.wav',
    'ALIVE_CHAMBER': 'static/IR/H3000/575_ALIVE_CHAMBER.wav',
    'BIG_SWEEP': 'static/IR/H3000/577_BIG_SWEEP.wav',
    "BOB'S_ROOM": "static/IR/H3000/578_BOB'S_ROOM.wav",
    'BREATHING_CANYON': 'static/IR/H3000/579_BREATHING_CANYON.wav',
    'BRIGHT_ROOM': 'static/IR/H3000/580_BRIGHT_ROOM.wav',
    'CANYON': 'static/IR/H3000/581_CANYON.wav',
    'CONCERT_HALL': 'static/IR/H3000/582_CONCERT_HALL.wav',
    'DARK_ROOM': 'static/IR/H3000/583_DARK_ROOM.wav',
    'DISCRETE-VERB': 'static/IR/H3000/584_DISCRETE-VERB.wav',
    'NORTHWEST_HALL': 'static/IR/H3000/585_NORTHWEST_HALL.wav',
    'RICH_PLATE': 'static/IR/H3000/586_RICH_PLATE.wav',
    'SLAPVERB': 'static/IR/H3000/587_SLAPVERB.wav',
    'SMOOTH_PLATE': 'static/IR/H3000/588_SMOOTH_PLATE.wav',
    'WARM_HALL': 'static/IR/H3000/589_WARM_HALL.wav',
    'ECHO-VERB': 'static/IR/H3000/591_ECHO-VERB.wav',
    "EXPLODING_'vERB": "static/IR/H3000/592_EXPLODING_'vERB.wav",
    'GATED_REVERB': 'static/IR/H3000/593_GATED_REVERB.wav',
    'GATED_ROOM': 'static/IR/H3000/594_GATED_ROOM.wav',
    'GATE_ROOM': 'static/IR/H3000/595_GATE_ROOM.wav',
    'HUMP-VERB': 'static/IR/H3000/596_HUMP-VERB.wav',
    'METALVERB': 'static/IR/H3000/597_METALVERB.wav',
    'RANDOM_GATE': 'static/IR/H3000/598_RANDOM_GATE.wav',
    'REVERSE_GATE': 'static/IR/H3000/600_REVERSE_GATE.wav',
    'REVERB_RAMP': 'static/IR/H3000/601_REVERB_RAMP.wav',
    'SHIMMERISH': 'static/IR/H3000/602_SHIMMERISH.wav',
    'TONAL_ROOM': 'static/IR/H3000/603_TONAL_ROOM.wav',
    'DRUM_PROCESSOR': 'static/IR/H3000/643_DRUM_PROCESSOR.wav',
    'LIQUID_REVERB': 'static/IR/H3000/646_LIQUID_REVERB.wav',
    'REVERSERB': 'static/IR/H3000/655_REVERSERB.wav',
    'BOUNCE_VERB': 'static/IR/H3000/712_BOUNCE_VERB.wav',
    'DEATHLESS_ROOM': 'static/IR/H3000/716_DEATHLESS_ROOM.wav',
    'ENDLESS_CAVE': 'static/IR/H3000/719_ENDLESS_CAVE.wav',
    'REVERB-a-BOUND': 'static/IR/H3000/736_REVERB-a-BOUND.wav',
    'SMALL_DARK_ROOM': 'static/IR/H3000/739_SMALL_DARK_ROOM.wav',
    'CLONEVERB': 'static/IR/H3000/793_CLONEVERB.wav',
    'LONG_&_SMOOTH': 'static/IR/H3000/795_LONG_&_SMOOTH.wav',
    'MEAT_LOCKER': 'static/IR/H3000/796_MEAT_LOCKER.wav',
    'ethereal': 'static/IR/H3000/833_ethereal.wav',
    'rewzNooRoom': 'static/IR/H3000/86_DrewzNooRoom.wav',
    'swell_reverb': 'static/IR/H3000/884_swell_reverb.wav',
    'PAPER_PLATE': 'static/IR/H3000/980_PAPER_PLATE.wav',
    'USEFUL_VERB_2': 'static/IR/H3000/985_USEFUL_VERB_2.wav',
    'ROBO_DRUM': 'static/IR/H3000/990_ROBO_DRUM.wav',
    'AIR_SHAMIR': 'static/IR/H3000/991_AIR_SHAMIR.wav',
    'SMALL_&_LIVE_VERB': 'static/IR/H3000/995_SMALL_&_LIVE_VERB.wav'
  };

  IR_LOADED = {};

}).call(this);
