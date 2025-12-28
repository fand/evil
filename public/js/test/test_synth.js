(function() {
  this.t.subtest('Synth JSON', function() {
    var i, param_original, s, s0, s1, song, v0, v1, _i, _ref;
    song = window.player.session.song;
    s = window.player.synth[0];
    param_original = s.getParam();
    s0 = {
      name: "s0",
      type: "REZ",
      pattern_name: "p1",
      scale_name: "minor",
      gains: [0, 1, 2],
      filter: [3, 4],
      eg: {
        adsr: [11, 22, 33, 44],
        range: [1, 5]
      },
      feg: {
        adsr: [55, 66, 77, 88],
        range: [10, 50]
      },
      vcos: [
        {
          fine: 1,
          interval: 2,
          octave: 3,
          shape: 'SINE'
        }, {
          fine: 4,
          interval: 5,
          octave: 6,
          shape: 'SAW'
        }, {
          fine: 7,
          interval: 8,
          octave: 9,
          shape: 'RECT'
        }
      ],
      harmony: 'harmony'
    };
    s.setSynthName(s0.name);
    s.setScale(s0.scale_name);
    s.core.setParam(s0);
    s1 = s.getParam();
    this.assertEq(s0.name, s1.name, 'synth name');
    this.assertEq(s0.scale_name, s1.scale_name, 'scale');
    this.assertArrayEq(s0.gains, s1.gains, 'mixer gains');
    this.assertArrayEq(s0.filter, s1.filter, 'filter');
    this.assertArrayEq(s0.eg.adsr, s1.eg.adsr, 'eg adsr');
    this.assertArrayEq(s0.feg.adsr, s1.feg.adsr, 'feg adsr');
    this.assertEq(s0.shape, s1.shape, 'harmony');
    for (i = _i = 0, _ref = s0.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      v0 = s0.vcos[i];
      v1 = s1.vcos[i];
      this.assertEq(v0.fine, v1.fine, 'fine');
      this.assertEq(v0.interval, v1.interval, 'interval');
      this.assertEq(v0.octave, v1.octave, 'octave');
      this.assertEq(v0.shape, v1.shape, 'shape');
    }
    return s.setParam(param_original);
  });

  this.t.subtest('Change synth type', function() {
    var s;
    s = window.player.synth[0];
    $('.synth-type').eq(0).val('SAMPLER').change();
    this.assertEq(window.player.synth[0].type, 'SAMPLER', 'changed to SAMPLER');
    this.assertEq(window.player.synth.length, 1, 'only 1 synth');
    $('.synth-type').eq(0).val('REZ').change();
    return this.assertEq(window.player.synth[0].type, 'REZ', 'changed to REZ');
  });

  this.t.subtest('Synth Sequencer', function() {
    var canvas, i, p0, s, _i;
    s = window.player.synth[0];
    canvas = $('#synth0 > .sequencer .table-hover');
    p0 = s.getPattern().pattern;
    for (i = _i = 0; _i < 3; i = ++_i) {
      this.mousedown(canvas, 26 * i + 10, 10);
      this.mouseup(canvas);
    }
    p0[0] = 20;
    p0[1] = 20;
    p0[2] = 20;
    this.assertArrayEq(p0, s.getPattern().pattern, 'click');
    this.mousedrag(canvas, [
      {
        x: 26 * 8 + 10,
        y: 10
      }, {
        x: 26 * 14 + 10,
        y: 10
      }
    ]);
    p0 = [20, 20, 20, 0, 0, 0, 0, 0, -20, 'sustain', 'sustain', 'sustain', 'sustain', 'sustain', 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.assertArrayEq(p0, s.getPattern().pattern, 'drag');
    this.mousedrag(canvas, [
      {
        x: 26 * 10 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 11 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 12 + 10,
        y: 26 * 1 + 10
      }
    ]);
    p0 = [20, 20, 20, 0, 0, 0, 0, 0, -20, 'end', -19, 'sustain', 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.assertArrayEq(p0, s.getPattern().pattern, 'drag and divide sustain');
    this.mousedrag(canvas, [
      {
        x: 26 * 9 + 10,
        y: 26 * 2 + 10
      }, {
        x: 26 * 10 + 10,
        y: 26 * 2 + 10
      }
    ]);
    p0 = [20, 20, 20, 0, 0, 0, 0, 0, 20, -18, 'end', -19, 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain');
    this.mousedrag(canvas, [
      {
        x: 26 * 8 + 10,
        y: 10
      }, {
        x: 26 * 14 + 10,
        y: 10
      }
    ]);
    this.mousedrag(canvas, [
      {
        x: 26 * 10 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 11 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 12 + 10,
        y: 26 * 1 + 10
      }
    ]);
    this.mousedrag(canvas, [
      {
        x: 26 * 9 + 10,
        y: 26 * 2 + 10
      }, {
        x: 26 * 10 + 10,
        y: 26 * 2 + 10
      }, {
        x: 26 * 11 + 10,
        y: 26 * 2 + 10
      }
    ]);
    p0 = [20, 20, 20, 0, 0, 0, 0, 0, 20, -18, 'sustain', 'end', 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain');
    this.mousedrag(canvas, [
      {
        x: 26 * 14 + 10,
        y: 10
      }, {
        x: 26 * 8 + 10,
        y: 10
      }
    ]);
    this.mousedrag(canvas, [
      {
        x: 26 * 12 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 11 + 10,
        y: 26 * 1 + 10
      }, {
        x: 26 * 10 + 10,
        y: 26 * 1 + 10
      }
    ]);
    this.mousedrag(canvas, [
      {
        x: 26 * 11 + 10,
        y: 26 * 2 + 10
      }, {
        x: 26 * 10 + 10,
        y: 26 * 2 + 10
      }, {
        x: 26 * 9 + 10,
        y: 26 * 2 + 10
      }
    ]);
    p0 = [20, 20, 20, 0, 0, 0, 0, 0, 20, -18, 'sustain', 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return this.assertArrayEq(p0, s.getPattern().pattern, 'drag RL');
  });

}).call(this);
