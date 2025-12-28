(function () {
  this.Tester = (function () {
    function Tester() {
      this.subtests = {};
    }

    Tester.prototype.subtest = function (s, t) {
      return (this.subtests[s] = t);
    };

    Tester.prototype.runAll = function () {
      var s, t, _ref, _results;
      _ref = this.subtests;
      _results = [];
      for (s in _ref) {
        t = _ref[s];
        console.group(s);
        t.call(this);
        _results.push(console.groupEnd());
      }
      return _results;
    };

    Tester.prototype.assert = function (v, s) {
      if (v) {
        return console.log('%c OK ... ' + s, 'color: #0d0;');
      } else {
        return console.log('%c FAILED! ... ' + s, 'color: #f44;');
      }
    };

    Tester.prototype.assertEq = function (v1, v2, s) {
      if (v1 === v2) {
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
        console.log('v1: ' + v1 + ', v2:' + v2);
      } else {
        console.group('%c FAILED! ... ' + s, 'color: #f44;');
        console.log('v1: ' + v1 + ', v2: ' + v2);
      }
      return console.groupEnd();
    };

    Tester.prototype.assertNotEq = function (v1, v2, s) {
      if (v1 !== v2) {
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
        console.log('v1: ' + v1 + ', v2:' + v2);
      } else {
        console.group('%c FAILED! ... ' + s, 'color: #f44;');
        console.log('v1: ' + v1 + ', v2: ' + v2);
      }
      return console.groupEnd();
    };

    Tester.prototype.assertMatch = function (v1, v2, s) {
      if (v1.match(v2)) {
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
        console.log('v1: ' + v1 + ', v2:' + v2);
      } else {
        console.group('%c FAILED! ... ' + s, 'color: #f44;');
        console.log('v1: ' + v1 + ', v2: ' + v2);
      }
      return console.groupEnd();
    };

    Tester.prototype.assertNotMatch = function (v1, v2, s) {
      if (!v1.match(v2)) {
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;');
        console.log('v1: ' + v1 + ', v2:' + v2);
      } else {
        console.group('%c FAILED! ... ' + s, 'color: #f44;');
        console.log('v1: ' + v1 + ', v2: ' + v2);
      }
      return console.groupEnd();
    };

    Tester.prototype.assertArrayEq = function (v1, v2, s) {
      var i, res, _i, _ref;
      res = true;
      if (v1.length !== v2.length) {
        res = false;
      }
      for (
        i = _i = 0, _ref = v1.length;
        0 <= _ref ? _i < _ref : _i > _ref;
        i = 0 <= _ref ? ++_i : --_i
      ) {
        if (
          v1[i] !== +v2[i] &&
          v1[i] !== v2[i] + '' &&
          v1[i] - +v2[i] > 0.00001
        ) {
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

    Tester.prototype.assertArrayNotEq = function (v1, v2, s) {
      var i, res, _i, _ref;
      res = true;
      if (v1.length !== v2.length) {
        res = false;
      }
      for (
        i = _i = 0, _ref = v1.length;
        0 <= _ref ? _i < _ref : _i > _ref;
        i = 0 <= _ref ? ++_i : --_i
      ) {
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

    Tester.prototype.mousedown = function (target, x, y) {
      var e, offset;
      offset = target.offset();
      e = new $.Event('mousedown');
      e.clientX = x + offset.left;
      e.clientY = y + offset.top;
      return target.trigger(e);
    };

    Tester.prototype.mouseup = function (target) {
      return target.trigger('mouseup');
    };

    Tester.prototype.mousedrag = function (target, pos) {
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

    return Tester;
  })();

  this.t = new this.Tester();

  this.subtest = function (s, t) {
    return this.t.subtest(s, t);
  };
}).call(this);
