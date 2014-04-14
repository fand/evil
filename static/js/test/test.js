(function() {
  var assert, assertArrayEq, assertArrayNotEq, assertEq, assertMatch, assertNotEq, assertNotMatch, mousedown, mousedrag, mouseup, subtest, test;

  test = function() {
    var k, p;
    p = window.player;
    k = window.keyboard;
    subtest('Main Control', function() {
      assertEq($('#control > [name=bpm]').val(), p.bpm + '', 'bpm');
      assertEq($('#control > [name=key]').val(), p.key + '', 'key');
      return assertEq($('#control > [name=mode]').val(), p.scale + '', 'scale');
    });
    subtest('Initial View: Synth at 0', function() {
      assertEq($('#btn-left').css('display'), 'none', 'btn-left hide');
      assertMatch($('#btn-left').attr('data-line1'), /prev/, 'btn-right text');
      assertEq($('#btn-right').css('display'), 'block', 'btn-right display');
      return assertMatch($('#btn-right').attr('data-line1'), /new/, 'btn-right text =~ "new"');
    });
    subtest('Synth JSON', function() {
      var i, param_original, s, s0, s1, song, v0, v1, _i, _ref;
      song = p.session.song;
      s = p.synth[0];
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
      assertEq(s0.name, s1.name, 'synth name');
      assertEq(s0.scale_name, s1.scale_name, 'scale');
      assertArrayEq(s0.gains, s1.gains, 'mixer gains');
      assertArrayEq(s0.filter, s1.filter, 'filter');
      assertArrayEq(s0.eg.adsr, s1.eg.adsr, 'eg adsr');
      assertArrayEq(s0.feg.adsr, s1.feg.adsr, 'feg adsr');
      assertEq(s0.shape, s1.shape, 'harmony');
      for (i = _i = 0, _ref = s0.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        v0 = s0.vcos[i];
        v1 = s1.vcos[i];
        assertEq(v0.fine, v1.fine, 'fine');
        assertEq(v0.interval, v1.interval, 'interval');
        assertEq(v0.octave, v1.octave, 'octave');
        assertEq(v0.shape, v1.shape, 'shape');
      }
      return s.setParam(param_original);
    });
    subtest('Change synth type', function() {
      var s;
      s = p.synth[0];
      $('.synth-type').eq(0).val('SAMPLER').change();
      assertEq(p.synth[0].type, 'SAMPLER', 'changed to SAMPLER');
      assertEq(p.synth.length, 1, 'only 1 synth');
      $('.synth-type').eq(0).val('REZ').change();
      return assertEq(p.synth[0].type, 'REZ', 'changed to REZ');
    });
    subtest('Synth JSON', function() {
      var i, param_original, s, s0, s1, song, synth_param_original, v0, v1, _i, _ref;
      song = p.session.song;
      synth_param_original = p.synth[0].getParam();
      $('.synth-type').eq(0).val('SAMPLER').change();
      s = p.synth[0];
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
      assertEq(s0.name, s1.name, 'synth name');
      for (i = _i = 0, _ref = s0.samples.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        v0 = s0.samples[i];
        v1 = s1.samples[i];
        assertEq(v0.wave, v1.wave, 'wave');
        assertArrayEq(v0.time, v1.time, 'time');
        assertArrayEq(v0.gains, v1.gains, 'gains');
        assertArrayEq(v0.output, v1.output, 'output');
      }
      $('.synth-type').eq(0).val('REZ').change();
      return p.synth[0].setParam(synth_param_original);
    });
    subtest('Main Control Change', function() {
      var c;
      c = {
        bpm: 200,
        key: 'D',
        scale: 'Major'
      };
      $('#control > [name=bpm]').val(c.bpm).change();
      $('#control > [name=key]').val(c.key).change();
      $('#control > [name=mode]').val(c.scale).change();
      assertEq(p.bpm, c.bpm, 'bpm');
      assertEq(p.key, c.key, 'key');
      return assertEq(p.scale, c.scale, 'scale');
    });
    return subtest('Synth Sequencer', function() {
      var canvas, i, p0, s, _i;
      s = p.synth[0];
      canvas = $('#synth0 > .sequencer .table-hover');
      p0 = s.getPattern().pattern;
      for (i = _i = 0; _i < 3; i = ++_i) {
        mousedown(canvas, 26 * i + 10, 10);
        mouseup(canvas);
      }
      p0[0] = 20;
      p0[1] = 20;
      p0[2] = 20;
      assertArrayEq(p0, s.getPattern().pattern, 'click');
      mousedrag(canvas, [
        {
          x: 26 * 8 + 10,
          y: 10
        }, {
          x: 26 * 14 + 10,
          y: 10
        }
      ]);
      p0 = [20, 20, 20, 0, 0, 0, 0, 0, -20, 'sustain', 'sustain', 'sustain', 'sustain', 'sustain', 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      assertArrayEq(p0, s.getPattern().pattern, 'drag');
      mousedrag(canvas, [
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
      assertArrayEq(p0, s.getPattern().pattern, 'drag and divide sustain');
      mousedrag(canvas, [
        {
          x: 26 * 9 + 10,
          y: 26 * 2 + 10
        }, {
          x: 26 * 10 + 10,
          y: 26 * 2 + 10
        }
      ]);
      p0 = [20, 20, 20, 0, 0, 0, 0, 0, 20, -18, 'end', -19, 'end', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain');
      mousedrag(canvas, [
        {
          x: 26 * 8 + 10,
          y: 10
        }, {
          x: 26 * 14 + 10,
          y: 10
        }
      ]);
      mousedrag(canvas, [
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
      mousedrag(canvas, [
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
      assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain');
      mousedrag(canvas, [
        {
          x: 26 * 14 + 10,
          y: 10
        }, {
          x: 26 * 8 + 10,
          y: 10
        }
      ]);
      mousedrag(canvas, [
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
      mousedrag(canvas, [
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
      return assertArrayEq(p0, s.getPattern().pattern, 'drag RL');
    });
  };

  mousedown = function(target, x, y) {
    var e, offset;
    offset = target.offset();
    e = new $.Event('mousedown');
    e.clientX = x + offset.left;
    e.clientY = y + offset.top;
    return target.trigger(e);
  };

  mouseup = function(target) {
    return target.trigger('mouseup');
  };

  mousedrag = function(target, pos) {
    var e, offset, p, _i, _len;
    offset = target.offset();
    e = new $.Event('mousedown');
    e.clientX = pos[0].x + offset.left;
    e.clientY = pos[0].y + offset.top;
    target.trigger(e);
    for (_i = 0, _len = pos.length; _i < _len; _i++) {
      p = pos[_i];
      e = new $.Event('mousemove');
      e.clientX = p.x + offset.left;
      e.clientY = p.y + offset.top;
      target.trigger(e);
    }
    return target.trigger('mouseup');
  };

  subtest = function(s, t) {
    console.group(s);
    t();
    return console.groupEnd();
  };

  assert = function(v, s) {
    if (v) {
      return console.log('%c OK ... ' + s, 'color: #0d0;');
    } else {
      return console.log('%c FAILED! ... ' + s, 'color: #f44;');
    }
  };

  assertEq = function(v1, v2, s) {
    if (v1 === v2) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
    }
    return console.groupEnd();
  };

  assertNotEq = function(v1, v2, s) {
    if (v1 !== v2) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
    }
    return console.groupEnd();
  };

  assertMatch = function(v1, v2, s) {
    if (v1.match(v2)) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
    }
    return console.groupEnd();
  };

  assertNotMatch = function(v1, v2, s) {
    if (!v1.match(v2)) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
    }
    return console.groupEnd();
  };

  assertArrayEq = function(v1, v2, s) {
    var i, res, _i, _ref;
    res = true;
    if (v1.length !== v2.length) {
      res = false;
    }
    for (i = _i = 0, _ref = v1.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (v1[i] !== +v2[i] && v1[i] !== v2[i] + '' && v1[i] - +v2[i] > 0.00001) {
        res = false;
      }
    }
    if (res) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1);
      console.log('v2: ' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1);
      console.log('v2: ' + v2);
    }
    return console.groupEnd();
  };

  assertArrayNotEq = function(v1, v2, s) {
    var i, res, _i, _ref;
    res = true;
    if (v1.length !== v2.length) {
      res = false;
    }
    for (i = _i = 0, _ref = v1.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (v1[i] !== +v2[i] && v1[i] !== v2[i] + '') {
        res = false;
      }
    }
    if (!res) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
    }
    return console.groupEnd();
  };

  $(function() {
    return setTimeout((function() {
      return test();
    }), 1000);
  });

}).call(this);
