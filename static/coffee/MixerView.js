(function() {
  this.MixerView = (function() {
    function MixerView(model) {
      this.model = model;
      this.dom = $('#mixer');
      this.canvas_bank_dom = $('#mixer-bank');
      this.canvas_session_dom = $('#mixer-session');
      this.session_wrapper = $('#mixer-session-wrapper');
      this.mixer = $('#mixer-mixer');
      this.gains = this.dom.find('.mixer-track > .gain-slider');
      this.gain_master = this.dom.find('.mixer-track-master > .gain-slider');
      this.pans = this.dom.find('.mixer-track > .pan-slider');
      this.pan_master = this.dom.find('.mixer-track-master > .pan-slider');
      this.canvas_session = this.canvas_session_dom[0];
      this.ctx_session = this.canvas_session.getContext('2d');
      this.track_dom = $('#templates > .mixer-track');
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
        return _this.setParams();
      });
    };

    MixerView.prototype.redraw = function(synth) {
      var s, _i, _len, _ref, _results;
      this.mixer.remove('mixer-track');
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(this.mixer.append(this.track_dom.clone()));
      }
      return _results;
    };

    MixerView.prototype.addSynth = function(synth) {
      var dom,
        _this = this;
      dom = this.track_dom.clone();
      this.mixer.append(dom);
      this.pans.push(dom.find('.pan-slider'));
      this.gains.push(dom.find('.gain-slider'));
      this.mixer.on('change', function() {
        return _this.setGains();
      });
      return this.setParams();
    };

    MixerView.prototype.setGains = function() {
      var g, g_master, _g;
      g = (function() {
        var _i, _len, _ref, _results;
        _ref = this.gains;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _g = _ref[_i];
          _results.push(parseFloat(_g.val()) / -100.0);
        }
        return _results;
      }).call(this);
      g_master = parseFloat(this.gain_master.val() / 100.0);
      return this.model.setGains(g, g_master);
    };

    MixerView.prototype.setPans = function() {
      var p, p_master, _p;
      p = (function() {
        var _i, _len, _ref, _results;
        _ref = this.pans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _p = _ref[_i];
          _results.push(this.pan2pos(1.0 - (parseFloat(_p.val())) / 100.0));
        }
        return _results;
      }).call(this);
      p_master = this.pan2pos(1.0 - parseFloat(this.pan_master.val() / 100.0));
      return this.model.setPans(p, p_master);
    };

    MixerView.prototype.setParams = function() {
      this.setGains();
      return this.setPans();
    };

    MixerView.prototype.displayGains = function(gains) {};

    MixerView.prototype.pan2pos = function(v) {
      var theta;
      theta = v * Math.PI;
      return [Math.cos(theta), 0, -Math.sin(theta)];
    };

    return MixerView;

  })();

}).call(this);
