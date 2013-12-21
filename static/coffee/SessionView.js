(function() {
  this.SessionView = (function() {
    function SessionView(model) {
      var _this = this;
      this.model = model;
      this.canvas_tracks_dom = $('#session-tracks');
      this.canvas_master_dom = $('#session-master');
      this.canvas_tracks_on_dom = $('#session-tracks-on');
      this.canvas_master_on_dom = $('#session-master-on');
      this.canvas_tracks_hover_dom = $('#session-tracks-hover');
      this.canvas_master_hover_dom = $('#session-master-hover');
      this.canvas_tracks = this.canvas_tracks_dom[0];
      this.canvas_master = this.canvas_master_dom[0];
      this.canvas_tracks_on = this.canvas_tracks_on_dom[0];
      this.canvas_master_on = this.canvas_master_on_dom[0];
      this.canvas_tracks_hover = this.canvas_tracks_hover_dom[0];
      this.canvas_master_hover = this.canvas_master_hover_dom[0];
      this.ctx_tracks = this.canvas_tracks.getContext('2d');
      this.ctx_master = this.canvas_master.getContext('2d');
      this.ctx_tracks_on = this.canvas_tracks_on.getContext('2d');
      this.ctx_master_on = this.canvas_master_on.getContext('2d');
      this.ctx_tracks_hover = this.canvas_tracks_hover.getContext('2d');
      this.ctx_master_hover = this.canvas_master_hover.getContext('2d');
      this.w = 80;
      this.h = 22;
      this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.img_play = new Image();
      this.img_play.src = 'static/img/play.png';
      this.img_play.onload = function() {
        return _this.initCanvas();
      };
      this.last_active = [];
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
    }

    SessionView.prototype.initCanvas = function() {
      this.canvas_tracks.width = this.canvas_tracks_on.width = this.canvas_tracks_hover.width = this.w * 8 + 1;
      this.canvas_master.width = this.canvas_master_on.width = this.canvas_master_hover.width = this.w + 1;
      this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = this.h * 15 + 10;
      this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = this.h * 15 + 10;
      this.offset_y = 20;
      this.ctx_tracks.translate(0, this.offset_y);
      this.ctx_master.translate(0, this.offset_y);
      this.ctx_tracks_on.translate(0, this.offset_y);
      this.ctx_master_on.translate(0, this.offset_y);
      this.ctx_tracks_hover.translate(0, this.offset_y);
      this.ctx_master_hover.translate(0, this.offset_y);
      this.font_size = 12;
      this.ctx_tracks.font = this.ctx_master.font = this.font_size + 'px "ＭＳ Ｐゴシック"';
      this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
      this.rect_master = this.canvas_master_hover.getBoundingClientRect();
      this.offset_translate = 700 + this.offset_y;
      return this.initEvent();
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
        pos = _this.getPos(_this.rect_tracks, e);
        return _this.drawHover(pos);
      }).on('mouseout', function(e) {
        _this.clearHover();
        return _this.hover_pos = {
          x: -1,
          y: -1
        };
      });
      this.canvas_master_hover_dom.on('mousemove', function(e) {
        var pos;
        return pos = _this.getPos(_this.rect_master, e);
      });
      return this.readSong(this.song);
    };

    SessionView.prototype.readSong = function(song) {
      var t, x, y, _i, _j, _k, _ref, _ref1, _ref2;
      this.song = song;
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
      ctx.strokeStyle = this.color[1];
      ctx.lineWidth = 2;
      ctx.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
      ctx.drawImage(this.img_play, 0, 0, 18, 18, x * this.w + 4, y * this.h + 4, 15, 16);
      ctx.fillStyle = this.color[1];
      return ctx.fillText(p.name, x * this.w + 24, (y + 1) * this.h - 6);
    };

    SessionView.prototype.drawEmpty = function(ctx, x, y) {
      this.clearCell(ctx, x, y);
      ctx.strokeStyle = this.color[0];
      ctx.lineWidth = 1;
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

    SessionView.prototype.drawScene = function(pos, next_pos) {
      var x, y, _i, _ref;
      this.ctx_tracks_on.clearRect(0, this.scene_pos * this.h, this.w * 8, this.h);
      this.ctx_master_on.clearRect(0, this.scene_pos * this.h, this.w, this.h);
      for (x = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        y = (next_pos != null) && (next_pos[x] != null) ? next_pos[x] : pos;
        this.drawActive(x, y);
      }
      this.drawActiveMaster(pos);
      return this.scene_pos = pos;
    };

    SessionView.prototype.drawActive = function(x, y) {
      this.clearActive(x);
      this.ctx_tracks_on.strokeStyle = 'rgba(0, 230, 255, 0.3)';
      this.ctx_tracks_on.lineWidth = 2;
      this.ctx_tracks_on.strokeRect(x * this.w + 4, y * this.h + 4, this.w - 6, this.h - 6);
      this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 4, y * this.h + 4, 15, 16);
      return this.last_active[x] = y;
    };

    SessionView.prototype.drawActiveMaster = function(y) {
      this.ctx_master_on.clearRect(0, 0, this.w, 10000);
      this.ctx_master_on.strokeStyle = 'rgba(0, 230, 255, 0.3)';
      this.ctx_master_on.lineWidth = 2;
      console.log('y: ' + y);
      this.ctx_master_on.strokeRect(4, y * this.h + 4, this.w - 6, this.h - 6);
      return this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, 4, y * this.h + 4, 15, 16);
    };

    SessionView.prototype.drawHover = function(pos) {
      this.clearHover();
      this.ctx_tracks_hover.fillStyle = 'rgba(255,255,255,0.4)';
      this.ctx_tracks_hover.fillRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      return this.hover_pos = pos;
    };

    SessionView.prototype.clearHover = function() {
      this.ctx_tracks_hover.clearRect(this.hover_pos.x * this.w, -100, this.w, 10000);
      return this.ctx_tracks_hover.clearRect(0, this.hover_pos.y * this.h, 10000, this.h);
    };

    SessionView.prototype.clearActive = function(x) {
      return this.ctx_tracks_on.clearRect(x * this.w, this.last_active[x] * this.h, this.w, this.h);
    };

    return SessionView;

  })();

}).call(this);
