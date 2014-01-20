(function() {
  var assert, assertEq, assertMatch, assertNotEq, assertNotMatch, subtest, test;

  test = function() {
    var p;
    p = window.player;
    subtest('Main Control', function() {
      assertEq($('#control > [name=bpm]').val(), p.bpm + '', 'bpm');
      assertEq($('#control > [name=key]').val(), p.key + '', 'key');
      return assertEq($('#control > [name=mode]').val(), p.scale + '', 'scale');
    });
    return subtest('Initial View: Synth at 0', function() {
      assertEq($('#btn-left').css('display'), 'none', 'btn-left hide');
      assertMatch($('#btn-left').attr('data-line1'), /prev/, 'btn-right text');
      assertEq($('#btn-right').css('display'), 'block', 'btn-right display');
      return assertMatch($('#btn-right').attr('data-line1'), /new/, 'btn-right text =~ "new"');
    });
  };

  subtest = function(s, t) {
    console.log(s);
    return t();
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
      return console.log('%c OK ... ' + s, 'color: #4f4;');
    } else {
      console.log('%c FAILED! ... ' + s, 'color: #f44;');
      return console.log('v1: ' + v1 + ', v2: ' + v2);
    }
  };

  assertNotEq = function(v1, v2, s) {
    if (v1 !== v2) {
      return console.log('%c OK ... ' + s, 'color: #4f4;');
    } else {
      console.log('%c FAILED! ... ' + s, 'color: #f44;');
      return console.log('v1: ' + v1 + ', v2: ' + v2);
    }
  };

  assertMatch = function(v1, v2, s) {
    if (v1.match(v2)) {
      return console.log('%c OK ... ' + s, 'color: #4f4;');
    } else {
      console.log('%c FAILED! ... ' + s, 'color: #f44;');
      return console.log('v1: ' + v1 + ', v2: ' + v2);
    }
  };

  assertNotMatch = function(v1, v2, s) {
    if (!v1.match(v2)) {
      return console.log('%c OK ... ' + s, 'color: #4f4;');
    } else {
      console.log('%c FAILED! ... ' + s, 'color: #f44;');
      return console.log('v1: ' + v1 + ', v2: ' + v2);
    }
  };

  $(function() {
    return setTimeout((function() {
      return test();
    }), 1000);
  });

}).call(this);
