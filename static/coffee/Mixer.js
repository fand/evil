(function() {
  this.Mixer = (function() {
    function Mixer(ctx, player) {
      var s;
      this.ctx = ctx;
      this.player = player;
      this.gain_master = 1.0;
      this.gains = (function() {
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
      this.view = new MixerView(this);
    }

    Mixer.prototype.addSynth = function(synth) {
      var p;
      p = this.ctx.createPanner();
      p.panningModel = "equalpower";
      synth.connect(p);
      p.connect(this.node);
      this.panners.push(p);
      return this.view.addSynth(synth);
    };

    Mixer.prototype.removeSynth = function(i) {
      return this.panners.splice(i);
    };

    Mixer.prototype.setGains = function(gains, gain_master) {
      var i, _i, _ref;
      this.gains = gains;
      this.gain_master = gain_master;
      for (i = _i = 0, _ref = this.gains.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.player.synth[i].setGain(this.gains[i]);
      }
      return this.node.gain.value = this.gain_master;
    };

    Mixer.prototype.setPans = function(pans, pan_master) {
      var i, p, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = pans.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = pans[i];
        _results.push(this.panners[i].setPosition(p[0], p[1], p[2]));
      }
      return _results;
    };

    return Mixer;

  })();

}).call(this);
