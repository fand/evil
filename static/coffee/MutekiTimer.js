(function() {
  'use strict';
  var MutekiTimer, SOURCE, TIMER_PATH, clearTimeout, e, pool, setTimeout, tid, _clearTimeout, _ref, _ref1, _setTimeout,
    _this = this;

  setTimeout = this.setTimeout;

  clearTimeout = this.clearTimeout;

  SOURCE = 'var t = 0;\nonmessage = function(e) {\n    if (t) {\n        t = clearTimeout(t), 0;\n    }\n    if (typeof e.data === "number" && e.data > 0) {\n        t = setTimeout(function() {\n            postMessage(0);\n        }, e.data);\n    }\n};';

  TIMER_PATH = (_ref = (_ref1 = this.URL) != null ? _ref1 : this.webkitURL) != null ? _ref.createObjectURL((function() {
    try {
      return new Blob([SOURCE], {
        type: 'text/javascript'
      });
    } catch (_error) {
      e = _error;
      return null;
    }
  })()) : void 0;

  MutekiTimer = (function() {
    function MutekiTimer() {
      if (TIMER_PATH) {
        this.timer = new Worker(TIMER_PATH);
      } else {
        this.timer = 0;
      }
    }

    MutekiTimer.prototype.setTimeout = function(func, interval) {
      if (interval == null) {
        interval = 100;
      }
      if (typeof this.timer === 'number') {
        return this.timer = setTimeout(func, interval);
      } else {
        this.timer.onmessage = func;
        return this.timer.postMessage(interval);
      }
    };

    MutekiTimer.prototype.clearTimeout = function() {
      if (typeof this.timer === 'number') {
        return clearTimeout(this.timer);
      } else {
        return this.timer.postMessage(0);
      }
    };

    return MutekiTimer;

  })();

  tid = +new Date();

  pool = {};

  _setTimeout = function(func, interval) {
    var t;
    t = new MutekiTimer();
    t.setTimeout(func, interval);
    pool[++tid] = t;
    return tid;
  };

  _clearTimeout = function(id) {
    var _ref2;
    if ((_ref2 = pool[id]) != null) {
      _ref2.clearTimeout();
    }
    return void 0;
  };

  MutekiTimer.use = function() {
    _this.setTimeout = _setTimeout;
    return _this.clearTimeout = _clearTimeout;
  };

  MutekiTimer.unuse = function() {
    _this.setTimeout = setTimeout;
    return _this.clearTimeout = clearTimeout;
  };

  MutekiTimer.isEnabled = function() {
    return !!TIMER_PATH;
  };

  this.MutekiTimer = MutekiTimer;

}).call(this);
