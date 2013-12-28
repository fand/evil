(function() {
  this.MixerView = (function() {
    function MixerView(model) {
      this.model = model;
      this.dom = $('#mixer');
      this.tracks = $('#mixer-tracks');
      this.master = $('#mixer-master');
      this.console_tracks = this.tracks.find('#console-tracks');
      this.console_master = this.master.find('#console-master');
      this.gains = this.tracks.find('.console-track > .gain-slider');
      this.gain_master = this.master.find('.console-track > .gain-slider');
      this.pans = this.tracks.find('.console-track > .pan-slider');
      this.pan_master = this.master.find('.console-track > .pan-slider');
      this.track_dom = $('#templates > .console-track');
      this.initEvent();
    }

    MixerView.prototype.initEvent = function() {
      var _this = this;
      this.console_tracks.on('change', function() {
        return _this.setParams();
      });
      return this.console_master.on('change', function() {
        return _this.setParams();
      });
    };

    MixerView.prototype.addSynth = function(synth) {
      var dom,
        _this = this;
      dom = this.track_dom.clone();
      this.console_tracks.append(dom);
      this.pans.push(dom.find('.pan-slider'));
      this.gains.push(dom.find('.gain-slider'));
      this.console_tracks.css({
        width: (this.gains.length * 80 + 2) + 'px'
      });
      this.console_tracks.on('change', function() {
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
          _results.push(parseFloat(_g.val()) / 100.0);
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

    MixerView.prototype.readGains = function(g, g_master) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = g.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.gains[i].val(g[i] * 100.0);
      }
      return this.gain_master.val(g_master * 100.0);
    };

    MixerView.prototype.readPans = function(p, p_master) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = p.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.pans[i].val(this.pos2pan(1.0 - (p[i] * 100.0))));
      }
      return _results;
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

    MixerView.prototype.pos2pan = function(v) {
      return Math.acos(v[0]) / Math.PI;
    };

    MixerView.prototype.empty = function() {
      this.console_tracks.empty();
      this.pans = [];
      return this.gains = [];
    };

    return MixerView;

  })();

}).call(this);
