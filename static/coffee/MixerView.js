(function() {
  this.MixerView = (function() {
    function MixerView(model) {
      this.model = model;
      this.dom = $('#mixer');
      this.canvas_bank_dom = $('#mixer-bank');
      this.canvas_session_dom = $('#mixer-session');
      this.session_wrapper = $('#mixer-session-wrapper');
      this.mixer = $('#mixer-mixer');
      this.gain_master = this.dom.find('.mixer-gain-master > input');
      this.canvas_session = this.canvas_session_dom[0];
      this.ctx_session = this.canvas_session.getContext('2d');
      this.initEvent();
    }

    MixerView.prototype.initCanvas = function() {
      var i, j, _i, _j;
      this.canvas_session.width = this.canvas_mixer.width = 832;
      this.canvas_session.height = this.canvas_mixer.height = 260;
      this.rect = this.canvas_session.getBoundingClientRect();
      for (i = _i = 0; _i < 10; i = ++_i) {
        for (j = _j = 0; _j < 32; j = ++_j) {
          this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.readPattern(this.pattern);
    };

    MixerView.prototype.initEvent = function() {
      var _this = this;
      return this.mixer.on('change', function() {
        return _this.setGains();
      });
    };

    MixerView.prototype.redraw = function(synth) {
      var dom, s, _i, _len, _ref, _results;
      this.mixer.remove('mixer-gain');
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        dom = $('<div class="mixer-gain"><input class="gain-slider" type="range" min="0" max="100" value="100" /></div>');
        _results.push(this.mixer.append(dom));
      }
      return _results;
    };

    MixerView.prototype.addSynth = function(synth) {
      var dom,
        _this = this;
      dom = $('<div class="mixer-gain"><input class="gain-slider" type="range" min="0" max="100" value="100" /></div>');
      this.mixer.append(dom);
      return this.mixer.on('change', function() {
        return _this.setGains();
      });
    };

    MixerView.prototype.setGains = function() {
      var g, gain_master, gains;
      console.log(this.gain_master);
      gains = (function() {
        var _i, _len, _ref, _results;
        _ref = this.mixer.find('.mixer-gain > input');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          _results.push(parseFloat(g.value) / 100.0);
        }
        return _results;
      }).call(this);
      gain_master = parseFloat(this.gain_master.val() / 100.0);
      return this.model.setGains(gains, gain_master);
    };

    MixerView.prototype.displayGains = function(gains) {};

    return MixerView;

  })();

}).call(this);
