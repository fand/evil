(function() {
  this.PlayerView = (function() {
    function PlayerView(model) {
      this.model = model;
      this.dom = $("#control");
      this.bpm = this.dom.find("[name=bpm]");
      this.key = this.dom.find("[name=key]");
      this.scale = this.dom.find("[name=mode]");
      this.footer = $('footer');
      this.play = $('#control-play');
      this.stop = $('#control-stop');
      this.forward = $('#control-forward');
      this.backward = $('#control-backward');
      this.loop = $('#control-loop');
      this.wrapper = $('#wrapper');
      this.instruments = $('#instruments');
      this.mixer = $('#mixer');
      this.is_mixer = false;
      this.btn_left = $('#btn-left');
      this.btn_right = $('#btn-right');
      this.btn_top = $('#btn-top');
      this.btn_bottom = $('#btn-bottom');
      this.synth_now = 0;
      this.synth_total = 1;
      this.initEvent();
      this.resize();
    }

    PlayerView.prototype.initEvent = function() {
      var _this = this;
      this.dom.on("change", function() {
        _this.setBPM();
        _this.setKey();
        return _this.setScale();
      });
      this.bpm.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.key.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.scale.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.play.on('mousedown', function() {
        return _this.viewPlay();
      });
      this.stop.on('mousedown', function() {
        return _this.viewStop(_this.model);
      });
      this.forward.on('mousedown', function() {
        return _this.model.forward();
      });
      this.backward.on('mousedown', function() {
        return _this.model.backward();
      });
      this.loop.on('mousedown', function() {
        if (_this.model.toggleLoop()) {
          return _this.loop.removeClass('control-off').addClass('control-on');
        } else {
          return _this.loop.removeClass('control-on').addClass('control-off');
        }
      });
      this.btn_left.on('mousedown', function() {
        return _this.moveLeft();
      });
      this.btn_right.on('mousedown', function() {
        return _this.moveRight();
      });
      this.btn_top.on('mousedown', function() {
        return _this.moveTop();
      });
      this.btn_bottom.on('mousedown', function() {
        return _this.moveBottom();
      });
      return $(window).on('resize', function() {
        return _this.resize();
      });
    };

    PlayerView.prototype.viewPlay = function() {
      if (this.model.isPlaying()) {
        this.model.pause();
        return this.play.removeClass("fa-pause").addClass("fa-play");
      } else {
        this.model.play();
        return this.play.removeClass("fa-play").addClass("fa-pause");
      }
    };

    PlayerView.prototype.viewStop = function(receiver) {
      if (receiver != null) {
        receiver.stop();
      }
      return this.play.removeClass("fa-pause").addClass("fa-play");
    };

    PlayerView.prototype.setBPM = function() {
      return this.model.setBPM(parseInt(this.bpm.val()));
    };

    PlayerView.prototype.setKey = function() {
      return this.model.setKey(this.key.val());
    };

    PlayerView.prototype.setScale = function() {
      return this.model.setScale(this.scale.val());
    };

    PlayerView.prototype.readBPM = function(bpm) {
      return this.bpm.val(bpm);
    };

    PlayerView.prototype.readScale = function(scale) {
      return this.scale.val(scale);
    };

    PlayerView.prototype.readKey = function(key) {
      var k, v, _results;
      _results = [];
      for (k in KEY_LIST) {
        v = KEY_LIST[k];
        if (v = key) {
          this.key.val(k);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PlayerView.prototype.readParam = function(bpm, key, scale) {
      this.readBPM(bpm);
      this.readKey(key);
      return this.readScale(scale);
    };

    PlayerView.prototype.moveRight = function() {
      if (this.is_mixer) {
        return;
      }
      this.synth_now++;
      this.model.moveRight(this.synth_now);
      this.synth_total = this.model.synth.length;
      this.instruments.css('-webkit-transform', 'translate3d(' + (-1110 * this.synth_now) + 'px, 0px, 0px)');
      this.btn_left.show();
      if (this.synth_now === (this.synth_total - 1)) {
        return this.btn_right.attr('data-line1', 'new');
      }
    };

    PlayerView.prototype.moveLeft = function() {
      if (this.is_mixer) {
        return;
      }
      this.synth_total = this.model.synth.length;
      this.btn_right.attr('data-line1', 'next');
      if (this.synth_now !== 0) {
        this.synth_now--;
        this.instruments.css('-webkit-transform', 'translate3d(' + (-1110 * this.synth_now) + 'px, 0px, 0px)');
        this.model.moveLeft(this.synth_now);
      }
      if (this.synth_now === 0) {
        return this.btn_left.hide();
      }
    };

    PlayerView.prototype.moveTop = function() {
      this.is_mixer = true;
      this.btn_left.hide();
      this.btn_right.hide();
      this.btn_top.hide();
      this.btn_bottom.show();
      this.wrapper.css('-webkit-transform', 'translate3d(0px, 700px, 0px)');
      return this.model.moveTop();
    };

    PlayerView.prototype.moveBottom = function() {
      this.is_mixer = false;
      if (this.synth_now !== 0) {
        this.btn_left.show();
      }
      this.btn_right.show();
      this.btn_top.show();
      this.btn_bottom.hide();
      this.wrapper.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
      return this.model.moveBottom();
    };

    PlayerView.prototype.setSynthNum = function(total, now) {
      this.synth_total = total;
      if (now < total - 1) {
        return this.btn_right.attr('data-line1', 'next');
      }
    };

    PlayerView.prototype.resize = function() {
      var h, ph, pw, space_h, space_w, w;
      w = $(window).width();
      h = $(window).height();
      space_w = (w - 910) / 2;
      space_h = (h - 600) / 2;
      pw = space_w / 2 - 50;
      ph = space_h / 2 - 50;
      this.btn_left.css({
        width: space_w + 'px',
        padding: '250px ' + 25 + 'px'
      });
      this.btn_right.css({
        width: space_w + 'px',
        padding: '250px ' + 35 + 'px'
      });
      this.btn_top.css({
        height: space_h + 'px'
      });
      this.btn_bottom.css({
        bottom: space_h + 'px',
        height: 100 + 'px'
      });
      return this.footer.css({
        height: space_h + 'px'
      });
    };

    PlayerView.prototype.changeSynth = function() {
      if (this.synth_now === 0) {
        this.btn_left.hide();
      }
      if (this.synth_now === (this.synth_total - 1)) {
        return this.btn_right.attr('data-line1', 'new');
      }
    };

    PlayerView.prototype.empty = function() {
      return this.instruments.empty();
    };

    return PlayerView;

  })();

}).call(this);
