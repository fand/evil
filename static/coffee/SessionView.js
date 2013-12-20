(function() {
  this.SessionView = (function() {
    function SessionView(model) {
      this.model = model;
      this.canvas_tracks_dom = $('#session-tracks');
      this.canvas_master_dom = $('#session-master');
      this.canvas_tracks_hover_dom = $('#session-tracks-hover');
      this.canvas_master_hover_dom = $('#session-master-hover');
      this.canvas_tracks = this.canvas_tracks_dom[0];
      this.canvas_master = this.canvas_master_dom[0];
      this.canvas_tracks_hover = this.canvas_tracks_hover_dom[0];
      this.canvas_master_hover = this.canvas_master_hover_dom[0];
      this.ctx_tracks = this.canvas_tracks.getContext('2d');
      this.ctx_master = this.canvas_master.getContext('2d');
      this.ctx_tracks_hover = this.canvas_tracks_hover.getContext('2d');
      this.ctx_master_hover = this.canvas_master_hover.getContext('2d');
      this.w = 80;
      this.h = 22;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.initCanvas();
      this.initEvent();
    }

    SessionView.prototype.initCanvas = function() {
      this.canvas_tracks.width = this.canvas_tracks_hover.width = this.w * 8 + 1;
      this.canvas_master.width = this.canvas_master_hover.width = this.w + 1;
      this.canvas_tracks.height = this.canvas_master.height = this.h * 15 + 10;
      this.canvas_tracks_hover.height = this.canvas_master_hover.height = this.h * 15 + 10;
      this.offset_y = 20;
      this.ctx_tracks.translate(0, this.offset_y);
      this.ctx_master.translate(0, this.offset_y);
      this.ctx_tracks_hover.translate(0, this.offset_y);
      this.ctx_master_hover.translate(0, this.offset_y);
      this.font_size = 12;
      this.ctx_tracks.font = this.ctx_master.font = this.font_size + 'px "ＭＳ Ｐゴシック"';
      this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
      this.rect_master = this.canvas_master_hover.getBoundingClientRect();
      return this.offset_translate = 700 + this.offset_y;
    };

    SessionView.prototype.getPos = function(rect, e) {
      var _x, _y;
      _x = Math.floor((e.clientX - rect.left) / this.w);
      _y = Math.floor((e.clientY - rect.top - this.offset_translate) / this.h);
      return {
        x: _x,
        y: _y
      };
    };

    SessionView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_tracks_hover_dom.on('mousemove', function(e) {
        var pos;
        return pos = _this.getPos(_this.rect_tracks, e);
      });
      return this.canvas_master_hover_dom.on('mousemove', function(e) {
        var pos;
        return pos = _this.getPos(_this.rect_master, e);
      });
    };

    SessionView.prototype.readSong = function(song) {
      var t, x, y, _i, _j, _k, _ref, _ref1, _ref2;
      for (x = _i = 0, _ref = Math.max(song.tracks.length + 1, 8); 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        t = song.tracks[x];
        if ((t != null) && (t.name != null)) {
          this.drawTrackName(this.ctx_tracks, t.name, x);
        }
        for (y = _j = 0, _ref1 = Math.max(song.length, 10); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if ((t != null) && (t.patterns[y] != null)) {
            this.drawCell(this.ctx_tracks, t.patterns[y], x, y);
          } else {
            this.drawEmpty(this.ctx_tracks, x, y);
          }
        }
      }
      for (y = _k = 0, _ref2 = Math.max(song.master.length, 10); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
        if (song.master[y] != null) {
          this.drawCell(this.ctx_master, song.master[y], 0, y);
        } else {
          this.drawEmpty(this.ctx_master, 0, y);
        }
      }
      return this.drawScene(0);
    };

    SessionView.prototype.drawCell = function(ctx, p, x, y) {
      this.clearCell(ctx, x, y);
      ctx.fillStyle = this.color[2];
      ctx.fillRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
      ctx.fillStyle = this.color[4];
      return ctx.fillText(p.name, x * this.w + 4, (y + 1) * this.h - 6);
    };

    SessionView.prototype.drawEmpty = function(ctx, x, y) {
      this.clearCell(ctx, x, y);
      ctx.strokeStyle = this.color[0];
      return ctx.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
    };

    SessionView.prototype.clearCell = function(ctx, x, y) {
      return ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    };

    SessionView.prototype.drawTrackName = function(ctx, name, x) {
      var dx, dy, m;
      ctx.fillStyle = this.color[1];
      ctx.fillRect(x * this.w + 2, -20, this.w - 2, 18);
      m = ctx.measureText(name);
      dx = (this.w - m.width) / 2;
      dy = (this.offset_y - this.font_size) / 2;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 1;
      ctx.fillStyle = '#fff';
      ctx.fillText(name, x * this.w + dx + 2, -dy - 3);
      return ctx.shadowBlur = 0;
    };

    SessionView.prototype.drawScene = function(pos) {
      this.ctx_tracks_hover.clearRect(0, this.scene_pos * this.h, this.w * 8, this.h);
      this.ctx_master_hover.clearRect(0, this.scene_pos * this.h, this.w, this.h);
      this.ctx_tracks_hover.shadowColor = this.ctx_master_hover.shadowColor = '#0df';
      this.ctx_tracks_hover.shadowBlur = this.ctx_master_hover.shadowBlur = 3;
      this.ctx_tracks_hover.fillStyle = 'rgba(255,255,255,0.4)';
      this.ctx_tracks_hover.fillRect(2, pos * this.h + 2, this.w * 8 - 2, this.h - 2);
      this.ctx_master_hover.fillStyle = 'rgba(255,255,255,0.4)';
      this.ctx_master_hover.fillRect(2, pos * this.h + 2, this.w - 2, this.h - 2);
      this.ctx_tracks_hover.clearRect(2, pos * this.h + 2, this.w * 8 - 2, this.h - 2);
      this.ctx_master_hover.clearRect(2, pos * this.h + 2, this.w - 2, this.h - 2);
      return this.scene_pos = pos;
    };

    return SessionView;

  })();

}).call(this);
