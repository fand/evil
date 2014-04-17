(function() {
  this.t.subtest('Sampler JSON', function() {
    var i, param_original, s, s0, s1, song, synth_param_original, v0, v1, _i, _ref;
    song = window.player.session.song;
    synth_param_original = window.player.synth[0].getParam();
    $('.synth-type').eq(0).val('SAMPLER').change();
    s = window.player.synth[0];
    param_original = s.getParam();
    s0 = {
      name: "s0",
      type: "SAMPLER",
      pattern_name: "p1",
      effects: [],
      samples: [
        {
          wave: "clp_raw",
          time: [4, 5, 6],
          gains: [0.0, 0.1, 0.2],
          output: [0.5, 0.4]
        }, {
          wave: "bd_909dwsd",
          time: [0, 1, 2],
          gains: [0.0, 0.1, 0.2],
          output: [0.0, 0.0]
        }, {
          wave: "snr_drm909kit1",
          time: [2, 3, 4],
          gains: [0.0, 0.1, 0.2],
          output: [1.0, 0.2]
        }, {
          wave: "snr_mpc",
          time: [3, 4, 5],
          gains: [0.0, 0.1, 0.2],
          output: [0.5, 0.3]
        }, {
          wave: "hat_nice909open",
          time: [7, 8, 9],
          gains: [0.0, 0.1, 0.2],
          output: [0.0, 0.7]
        }, {
          wave: "clp_basics",
          time: [5, 6, 7],
          gains: [0.0, 0.1, 0.2],
          output: [1.0, 0.5]
        }, {
          wave: "bd_sub808",
          time: [1, 2, 3],
          gains: [0.0, 0.1, 0.2],
          output: [0.5, 0.1]
        }, {
          wave: "hat_lilcloser",
          time: [6, 7, 8],
          gains: [0.0, 0.1, 0.2],
          output: [0.0, 0.6]
        }, {
          wave: "tam_lifein2d",
          time: [0, 1, 2],
          gains: [0.0, 0.1, 0.2],
          output: [1.0, 0.9]
        }, {
          wave: "shaker_bot",
          time: [8, 9, 1],
          gains: [0.0, 0.1, 0.2],
          output: [0.5, 0.8]
        }
      ]
    };
    s.setSynthName(s0.name);
    s.core.setParam(s0);
    s1 = s.getParam();
    this.assertEq(s0.name, s1.name, 'synth name');
    for (i = _i = 0, _ref = s0.samples.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      v0 = s0.samples[i];
      v1 = s1.samples[i];
      this.assertEq(v0.wave, v1.wave, 'wave');
      this.assertArrayEq(v0.time, v1.time, 'time');
      this.assertArrayEq(v0.gains, v1.gains, 'gains');
      this.assertArrayEq(v0.output, v1.output, 'output');
    }
    $('.synth-type').eq(0).val('REZ').change();
    return window.player.synth[0].setParam(synth_param_original);
  });

}).call(this);
