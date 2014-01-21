(function() {
  var assert, assertArrayEq, assertArrayNotEq, assertEq, assertMatch, assertNotEq, assertNotMatch, subtest, test;

  test = function() {
    var p;
    p = window.player;
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
    return subtest('Synth JSON', function() {
      var i, s, s0, s1, song, v0, v1, _i, _ref, _results;
      song = p.session.song;
      s = p.synth[0];
      s0 = {
        name: "s0",
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
      s.core.readParam(s0);
      s1 = s.getParam();
      assertEq(s0.name, s1.name, 'synth name');
      assertEq(s0.scale_name, s1.scale_name, 'scale');
      assertArrayEq(s0.gains, s1.gains, 'mixer gains');
      assertArrayEq(s0.filter, s1.filter, 'filter');
      assertArrayEq(s0.eg.adsr, s1.eg.adsr, 'eg adsr');
      assertArrayEq(s0.feg.adsr, s1.feg.adsr, 'feg adsr');
      assertEq(s0.shape, s1.shape, 'harmony');
      _results = [];
      for (i = _i = 0, _ref = s0.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        v0 = s0.vcos[i];
        v1 = s1.vcos[i];
        assertEq(v0.fine, v1.fine, 'fine');
        assertEq(v0.interval, v1.interval, 'interval');
        assertEq(v0.octave, v1.octave, 'octave');
        _results.push(assertEq(v0.shape, v1.shape, 'shape'));
      }
      return _results;
    });
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
      if (v1[i] === +v2[i] && v1[i] === v2[i] + '') {
        res = false;
      }
    }
    if (res) {
      console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
      console.log('v1: ' + v1 + ', v2:' + v2);
    } else {
      console.group('%c FAILED! ... ' + s, 'color: #f44;');
      console.log('v1: ' + v1 + ', v2: ' + v2);
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
      if (v1[i] === v2[i]) {
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
