(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.KEYCODE_TO_NOTE = {
    90: 1,
    88: 2,
    67: 3,
    86: 4,
    66: 5,
    78: 6,
    77: 7,
    65: 8,
    83: 9,
    68: 10,
    188: 8,
    190: 9,
    192: 10,
    70: 11,
    71: 12,
    72: 13,
    74: 14,
    75: 15,
    76: 16,
    187: 17,
    81: 15,
    87: 16,
    69: 17,
    82: 18,
    84: 19,
    89: 20,
    85: 21,
    73: 22,
    79: 23,
    80: 24,
    49: 22,
    50: 23,
    51: 24,
    52: 25,
    53: 26,
    54: 27,
    55: 28,
    56: 29,
    57: 30,
    48: 31
  };

  this.KEYCODE_TO_NUM = {
    49: 1,
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
    48: 0
  };

  this.Keyboard = (function() {
    function Keyboard(player) {
      this.player = player;
      this.mode = 'SYNTH';
      this.is_writing = false;
      this.is_pressed = false;
      this.last_key = 0;
      this.solos = [];
      this.initEvent();
    }

    Keyboard.prototype.initEvent = function() {
      var _this = this;
      $(window).keydown(function(e) {
        if (_this.is_writing) {
          return;
        }
        if (_this.is_pressed === false) {
          _this.is_pressed = true;
        }
        return _this.on(e);
      });
      return $(window).keyup(function(e) {
        _this.is_pressed = false;
        return _this.off(e);
      });
    };

    Keyboard.prototype.beginInput = function() {
      return this.is_writing = true;
    };

    Keyboard.prototype.endInput = function() {
      return this.is_writing = false;
    };

    Keyboard.prototype.setMode = function(mode) {
      this.mode = mode;
    };

    Keyboard.prototype.on = function(e) {
      if (e.keyCode === this.last_key) {
        return;
      }
      switch (e.keyCode) {
        case 37:
          this.player.view.moveLeft();
          break;
        case 38:
          this.player.view.moveTop();
          break;
        case 39:
          this.player.view.moveRight();
          break;
        case 40:
          this.player.view.moveBottom();
          break;
        case 32:
          this.player.view.viewPlay();
          break;
        case 13:
          this.player.view.viewPlay();
          break;
        default:
          if (this.mode === 'SYNTH') {
            this.onPlayer(e);
          }
          if (this.mode === 'MIXER') {
            this.onMixer(e);
          }
      }
      return this.last_key = e.keyCode;
    };

    Keyboard.prototype.onPlayer = function(e) {
      var n;
      if (this.player.isPlaying()) {
        this.player.noteOff(true);
      }
      n = KEYCODE_TO_NOTE[e.keyCode];
      if (n != null) {
        return this.player.noteOn(n, true);
      }
    };

    Keyboard.prototype.onMixer = function(e) {
      var num;
      if (e.keyCode === 8 || e.keyCode === 46) {
        this.player.session.deleteCell();
      }
      num = KEYCODE_TO_NUM[e.keyCode];
      if ((num != null) && num < 10) {
        if (__indexOf.call(this.solos, num) < 0) {
          this.solos.push(num);
        }
        return this.player.solo(this.solos);
      }
    };

    Keyboard.prototype.off = function(e) {
      if (this.mode === 'SYNTH') {
        this.offPlayer(e);
      }
      if (this.mode === 'MIXER') {
        this.offMixer(e);
      }
      return this.last_key = 0;
    };

    Keyboard.prototype.offPlayer = function(e) {
      return this.player.noteOff(true);
    };

    Keyboard.prototype.offMixer = function(e) {
      var num;
      num = KEYCODE_TO_NUM[e.keyCode];
      if ((num != null) && num < 10) {
        this.solos = this.solos.filter(function(n) {
          return n !== num;
        });
        return this.player.solo(this.solos);
      }
    };

    return Keyboard;

  })();

}).call(this);
