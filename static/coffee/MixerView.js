(function() {
  this.MixerView = (function() {
    function MixerView(model) {
      var c, d, _i, _len, _ref, _ref1;
      this.model = model;
      this.dom = $('#mixer');
      this.tracks = $('#mixer-tracks');
      this.master = $('#mixer-master');
      this.console_tracks = this.tracks.find('#console-tracks');
      this.console_master = this.master.find('#console-master');
      this.gains = this.tracks.find('.console-track > .gain-slider');
      this.gain_master = this.master.find('.console-track > .gain-slider');
      this.pans_label = this.tracks.find('.console-track > .pan-label');
      this.pans = this.tracks.find('.console-track > .pan-slider');
      this.pan_master = this.master.find('.console-track > .pan-slider');
      this.canvas_tracks_dom = this.tracks.find('.vu-meter');
      this.canvas_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.canvas_tracks_dom;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          _results.push(d[0]);
        }
        return _results;
      }).call(this);
      this.ctx_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.canvas_tracks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getContext('2d'));
        }
        return _results;
      }).call(this);
      _ref = this.canvas_tracks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _ref1 = [10, 100], c.width = _ref1[0], c.height = _ref1[1];
      }
      this.canvas_master_dom = this.master.find('.vu-meter');
      this.canvas_master = this.canvas_master_dom[0];
      this.ctx_master = this.canvas_master.getContext('2d');
      this.canvas_master.width = 70;
      this.canvas_master.height = 130;
      this.ctx_master.fillStyle = '#fff';
      this.ctx_master.fillRect(10, 0, 50, 130);
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

    MixerView.prototype.drawGainTracks = function(i, data) {
      var h, v;
      v = Math.max.apply(null, data);
      h = (v - 128) / 128 * 100;
      this.ctx_tracks[i].clearRect(0, 0, 10, 100);
      this.ctx_tracks[i].fillStyle = '#0df';
      return this.ctx_tracks[i].fillRect(0, 100 - h, 10, h);
    };

    MixerView.prototype.drawGainMaster = function(data_l, data_r) {
      var h_l, h_r, v_l, v_r;
      v_l = Math.max.apply(null, data_l);
      v_r = Math.max.apply(null, data_r);
      h_l = (v_l - 128) / 128 * 130;
      h_r = (v_r - 128) / 128 * 130;
      this.ctx_master.clearRect(0, 0, 10, 130);
      this.ctx_master.clearRect(60, 0, 10, 130);
      this.ctx_master.fillStyle = '#0df';
      this.ctx_master.fillRect(0, 130 - h_l, 10, h_l);
      return this.ctx_master.fillRect(60, 130 - h_r, 10, h_r);
    };

    MixerView.prototype.addSynth = function(synth) {
      var d, dom, _ref,
        _this = this;
      dom = this.track_dom.clone();
      this.console_tracks.append(dom);
      this.pans.push(dom.find('.pan-slider'));
      this.gains.push(dom.find('.gain-slider'));
      this.pans_label.push(dom.find('.pan-label'));
      d = dom.find('.vu-meter');
      this.canvas_tracks_dom.push(d);
      this.canvas_tracks.push(d[0]);
      this.ctx_tracks.push(d[0].getContext('2d'));
      _ref = [10, 100], d[0].width = _ref[0], d[0].height = _ref[1];
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
      var i, l, p, p_master, t, _i, _p, _ref, _results;
      p = (function() {
        var _i, _len, _ref, _results;
        _ref = this.pans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _p = _ref[_i];
          _results.push(1.0 - parseFloat(_p.val()) / 200.0);
        }
        return _results;
      }).call(this);
      p_master = 1.0 - parseFloat(this.pan_master.val()) / 200.0;
      this.model.setPans(p, p_master);
      _results = [];
      for (i = _i = 0, _ref = this.pans.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        l = parseInt(this.pans[i].val()) - 100;
        t = l === 0 ? 'C' : (l < 0 ? (-l) + '% L' : l + '% R');
        _results.push(this.pans_label[i].text(t));
      }
      return _results;
    };

    MixerView.prototype.readGains = function(g, g_master) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = g.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.gains[i].val(g[i] * 100.0);
      }
      return this.gain_master.val(g_master * 100.0);
    };

    MixerView.prototype.readPans = function(p, p_master) {
      var i, l, t, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = p.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.pans[i].val((1.0 - p[i]) * 200);
        l = (p[i] * 200 - 100) * -1;
        t = l === 0 ? 'C' : (l < 0 ? (-l) + '% L' : l + '% R');
        _results.push(this.pans_label[i].text(t));
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
      this.canvas_tracks_dom = [];
      this.canvas_tracks = [];
      this.ctx_tracks = [];
      this.pans = [];
      this.gains = [];
      return this.pans_label = [];
    };

    return MixerView;

  })();

}).call(this);
