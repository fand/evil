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
      this.view = new MixerView(this);
    }

    Mixer.prototype.addSynth = function(synth) {
      synth.connect(this.node);
      return this.view.addSynth(synth);
    };

    Mixer.prototype.setGains = function(gains, gain_master) {
      var i, _i, _ref;
      this.gains = gains;
      this.gain_master = gain_master;
      for (i = _i = 0, _ref = this.gains.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.player.synth[i].setGain(this.gains[i]);
      }
      this.node.gain.value = this.gain_master;
      return console.log(this.gain_master);
    };

    return Mixer;

  })();

}).call(this);
