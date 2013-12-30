(function() {
  this.SessionView = (function() {
    function SessionView(model, song) {
      var i,
        _this = this;
      this.model = model;
      this.song = song;
      this.wrapper_mixer = $('#mixer-tracks');
      this.wrapper_master = $('#session-master-wrapper');
      this.wrapper_tracks = $('#session-tracks-wrapper');
      this.wrapper_tracks_sub = $('#session-tracks-wrapper-sub');
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
      this.h = 20;
      this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'];
      this.color_schemes = {
        REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'],
        SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 160, 216, 0.2)']
      };
      this.track_color = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 8; i = ++_i) {
          _results.push(this.color);
        }
        return _results;
      }).call(this);
      this.img_play = new Image();
      this.img_play.src = 'static/img/play.png';
      this.img_play.onload = function() {
        return _this.initCanvas();
      };
      this.last_active = [];
      this.current_cells = [];
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.select_pos = {
        x: -1,
        y: -1
      };
      this.last_clicked = performance.now();
      this.dialog = $('#dialog');
      this.dialog_wrapper = $('#dialog-wrapper');
      this.dialog_close = this.dialog.find('.dialog-close');
      this.btn_save = $('#btn-save');
      this.btn_clear = $('#btn-clear');
      this.song_info = $('#song-info');
      this.song_title = this.song_info.find('#song-title');
      this.song_creator = this.song_info.find('#song-creator');
      this.social_twitter = $('#twitter');
      this.social_facebook = $('#facebook');
      this.social_hatena = $('#hatena');
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
      this.ctx_tracks.font = this.ctx_master.font = this.font_size + 'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"';
      this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
      this.rect_master = this.canvas_master_hover.getBoundingClientRect();
      this.offset_translate = 700 + this.offset_y;
      return this.initEvent();
    };

    SessionView.prototype.resize = function() {
      var h_new, w_new;
      this.ctx_tracks.translate(0, -this.offset_y);
      this.ctx_master.translate(0, -this.offset_y);
      this.ctx_tracks_on.translate(0, -this.offset_y);
      this.ctx_master_on.translate(0, -this.offset_y);
      this.ctx_tracks_hover.translate(0, -this.offset_y);
      this.ctx_master_hover.translate(0, -this.offset_y);
      w_new = Math.max(this.song.tracks.length, 8) * this.w + 1;
      h_new = Math.max(this.song.length + 1, 15) * this.h + 10;
      this.canvas_tracks.width = this.canvas_tracks_on.width = this.canvas_tracks_hover.width = w_new;
      this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = h_new;
      this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = h_new;
      this.canvas_tracks_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_tracks_on_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_tracks_hover_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_master_dom.css({
        height: h_new + 'px'
      });
      this.canvas_master_on_dom.css({
        height: h_new + 'px'
      });
      this.canvas_master_hover_dom.css({
        height: h_new + 'px'
      });
      this.wrapper_tracks.css({
        width: w_new + 'px'
      });
      this.wrapper_tracks_sub.css({
        width: w_new + 'px'
      });
      this.ctx_tracks.translate(0, this.offset_y);
      this.ctx_master.translate(0, this.offset_y);
      this.ctx_tracks_on.translate(0, this.offset_y);
      this.ctx_master_on.translate(0, this.offset_y);
      this.ctx_tracks_hover.translate(0, this.offset_y);
      return this.ctx_master_hover.translate(0, this.offset_y);
    };

    SessionView.prototype.getPos = function(rect, wrapper, e) {
      var _x, _y;
      _x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
      _y = Math.floor((e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) / this.h);
      return {
        x: _x,
        y: _y
      };
    };

    SessionView.prototype.getPlayPos = function(rect, wrapper, e) {
      var _x, _y;
      _x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
      _y = Math.floor((e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) / this.h);
      if (!((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) - _x * this.w < 20 && (e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) - _y * this.h < 20)) {
        _y = -1;
      }
      return {
        x: _x,
        y: _y
      };
    };

    SessionView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_tracks_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e);
        if (_this.is_clicked) {
          return _this.drawDrag(_this.ctx_tracks_hover, pos);
        } else {
          return _this.drawHover(_this.ctx_tracks_hover, pos);
        }
      }).on('mouseout', function(e) {
        _this.clearHover(_this.ctx_tracks_hover);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.is_clicked = false;
      }).on('mousedown', function(e) {
        var now, pos;
        pos = _this.getPlayPos(_this.rect_tracks, _this.wrapper_tracks_sub, e);
        if (pos.y >= 0) {
          _this.cueTracks(pos.x, pos.y);
        } else {
          pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e);
          now = performance.now();
          if (now - _this.last_clicked < 500 && pos.y !== -1) {
            _this.editPattern(pos);
            _this.last_clicked = -10000;
          } else {
            _this.last_clicked = now;
          }
          _this.is_clicked = true;
        }
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e);
        if (_this.click_pos.x === pos.x && _this.click_pos.y === pos.y) {
          _this.selectCell(pos);
        } else {
          if (_this.click_pos.x !== pos.x || _this.click_pos.y !== pos.y) {
            _this.copyCell(_this.click_pos, pos);
          }
        }
        return _this.is_clicked = false;
      });
      this.canvas_master_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_master, _this.wrapper_master, e);
        if (_this.is_clicked) {
          return _this.drawDragMaster(_this.ctx_master_hover, pos);
        } else {
          return _this.drawHover(_this.ctx_master_hover, pos);
        }
      }).on('mouseout', function(e) {
        _this.clearHover(_this.ctx_master_hover);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.is_clicked = false;
      }).on('mousedown', function(e) {
        var pos;
        pos = _this.getPlayPos(_this.rect_master, _this.wrapper_master, e);
        if (pos.y >= 0) {
          _this.cueMaster(pos.x, pos.y);
        } else {
          pos = _this.getPos(_this.rect_master, _this.wrapper_master, e);
          _this.is_clicked = true;
        }
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_master, _this.wrapper_master, e);
        if (_this.click_pos.x === pos.x && _this.click_pos.y === pos.y) {
          _this.selectCellMaster(pos);
        } else {
          if (_this.click_pos.x !== pos.x || _this.click_pos.y !== pos.y) {
            _this.copyCellMaster(_this.click_pos, pos);
          }
        }
        return _this.is_clicked = false;
      });
      this.wrapper_master.on('scroll', function(e) {
        return _this.wrapper_tracks_sub.scrollTop(_this.wrapper_master.scrollTop());
      });
      this.wrapper_tracks_sub.on('scroll', function(e) {
        return _this.wrapper_master.scrollTop(_this.wrapper_tracks_sub.scrollTop());
      });
      this.btn_save.on('click', function() {
        return _this.model.saveSong();
      });
      this.dialog.on('mousedown', function(e) {
        if ((!_this.dialog_wrapper.is(e.target)) && _this.dialog_wrapper.has(e.target).length === 0) {
          return _this.closeDialog();
        }
      });
      this.dialog_close.on('mousedown', function() {
        return _this.closeDialog();
      });
      this.song_title.on('focus', function() {
        return window.keyboard.beginInput();
      }).on('change', function() {
        return _this.model.setSongTitle(_this.song_title.val());
      }).on('blur', function() {
        return window.keyboard.endInput();
      });
      this.song_creator.on('focus', function() {
        return window.keyboard.beginInput();
      }).on('change', function() {
        return _this.model.setCreatorName(_this.song_creator.val());
      }).on('blur', function() {
        return window.keyboard.endInput();
      });
      this.social_twitter.on('click', function() {
        return _this.share('twitter');
      });
      this.social_facebook.on('click', function() {
        return _this.share('facebook');
      });
      this.social_hatena.on('click', function() {
        return _this.share('hatena');
      });
      return this.readSong(this.song, this.current_cells);
    };

    SessionView.prototype.readSong = function(song, current_cells) {
      var t, x, y, _i, _j, _k, _ref, _ref1, _ref2;
      this.song = song;
      this.current_cells = current_cells;
      this.resize();
      for (x = _i = 0, _ref = Math.max(this.song.tracks.length + 1, 8); 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        t = this.song.tracks[x];
        if (t != null) {
          if (t.type != null) {
            this.track_color[x] = this.color_schemes[t.type];
          }
          if (t.name != null) {
            this.drawTrackName(x, t.name);
          }
        }
        for (y = _j = 0, _ref1 = Math.max(this.song.length + 1, 10); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if ((t != null) && (t.patterns[y] != null)) {
            this.drawCell(this.ctx_tracks, t.patterns[y], x, y);
          } else {
            this.drawEmpty(this.ctx_tracks, x, y);
          }
        }
      }
      this.drawMasterName();
      for (y = _k = 0, _ref2 = Math.max(this.song.length + 1, 10); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
        if (this.song.master[y] != null) {
          this.drawCell(this.ctx_master, this.song.master[y], 0, y);
        } else {
          this.drawEmptyMaster(y);
        }
      }
      this.drawScene(this.scene_pos, this.current_cells);
      this.song_title.val(this.song.title);
      return this.song_creator.val(this.song.creator);
    };

    SessionView.prototype.drawCell = function(ctx, p, x, y) {
      this.clearCell(ctx, x, y);
      if (this.track_color[x] == null) {
        this.track_color[x] = this.color_schemes[this.song.tracks[x].type];
      }
      ctx.strokeStyle = this.track_color[x][1];
      ctx.lineWidth = 1;
      ctx.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
      ctx.drawImage(this.img_play, 0, 0, 18, 18, x * this.w + 3, y * this.h + 3, 16, 15);
      ctx.fillStyle = this.track_color[x][1];
      return ctx.fillText(p.name, x * this.w + 24, (y + 1) * this.h - 6);
    };

    SessionView.prototype.drawEmpty = function(ctx, x, y) {
      this.clearCell(ctx, x, y);
      ctx.strokeStyle = this.color[0];
      ctx.lineWidth = 1;
      return ctx.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
    };

    SessionView.prototype.drawEmptyMaster = function(y) {
      this.clearCell(this.ctx_master, 0, y);
      this.ctx_master.strokeStyle = this.color[0];
      this.ctx_master.lineWidth = 1;
      this.ctx_master.strokeRect(2, y * this.h + 2, this.w - 2, this.h - 2);
      return this.ctx_master.drawImage(this.img_play, 0, 0, 18, 18, 3, y * this.h + 3, 16, 15);
    };

    SessionView.prototype.clearCell = function(ctx, x, y) {
      return ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    };

    SessionView.prototype.drawMasterName = function() {
      var dx, dy, m;
      m = this.ctx_master.measureText('MASTER');
      dx = (this.w - m.width) / 2;
      dy = (this.offset_y - this.font_size) / 2;
      this.ctx_master.fillStyle = '#ccc';
      return this.ctx_master.fillText('MASTER', dx + 2, -dy - 3);
    };

    SessionView.prototype.drawTrackName = function(x, name, type) {
      var dx, dy, m;
      if (type != null) {
        this.track_color[x] = this.color_schemes[type];
      }
      this.ctx_tracks.fillStyle = this.track_color[x][1];
      this.ctx_tracks.fillRect(x * this.w + 2, -20, this.w - 2, 18);
      m = this.ctx_tracks.measureText(name);
      dx = (this.w - m.width) / 2;
      dy = (this.offset_y - this.font_size) / 2;
      this.ctx_tracks.shadowColor = '#fff';
      this.ctx_tracks.shadowBlur = 1;
      this.ctx_tracks.fillStyle = '#fff';
      this.ctx_tracks.fillText(name, x * this.w + dx + 2, -dy - 3);
      return this.ctx_tracks.shadowBlur = 0;
    };

    SessionView.prototype.drawPatternName = function(x, y, p) {
      return this.drawCell(this.ctx_tracks, p, x, y);
    };

    SessionView.prototype.drawSceneName = function(y, name) {};

    SessionView.prototype.drawScene = function(pos, cells) {
      var i, _i, _ref;
      this.ctx_tracks_on.clearRect(0, this.scene_pos * this.h, this.w * 8, this.h);
      this.ctx_master_on.clearRect(0, this.scene_pos * this.h, this.w, this.h);
      if (cells != null) {
        this.current_cells = cells;
      }
      for (i = _i = 0, _ref = this.current_cells.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.drawActive(i, this.current_cells[i]);
      }
      this.drawActiveMaster(pos);
      this.scene_pos = pos;
      if (this.select_pos.type === 'tracks') {
        return this.selectCell(this.select_pos);
      } else if (this.select_pos.type === 'master') {
        return this.selectCellMaster(this.select_pos);
      }
    };

    SessionView.prototype.drawActive = function(x, y) {
      this.clearActive(x);
      this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 3, y * this.h + 3, 16, 15);
      return this.last_active[x] = y;
    };

    SessionView.prototype.drawActiveMaster = function(y) {
      this.ctx_master_on.clearRect(0, 0, this.w, 10000);
      return this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, 3, y * this.h + 3, 16, 15);
    };

    SessionView.prototype.drawDrag = function(ctx, pos) {
      var name;
      this.clearHover(ctx);
      if (this.song.tracks[this.click_pos.x] == null) {
        return;
      }
      if (this.song.tracks[this.click_pos.x].patterns == null) {
        return;
      }
      if (this.song.tracks[this.click_pos.x].patterns[this.click_pos.y] == null) {
        return;
      }
      name = this.song.tracks[this.click_pos.x].patterns[this.click_pos.y].name;
      if (pos.y >= Math.max(this.song.length, 10) || pos.y < 0) {
        return;
      }
      if (this.track_color[pos.x] == null) {
        this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
      }
      ctx.fillStyle = 'rgba(255,255,255,1.0)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);
      ctx.strokeStyle = this.track_color[pos.x][1];
      ctx.fillStyle = this.track_color[pos.x][1];
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      ctx.fillText(name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);
      return this.hover_pos = pos;
    };

    SessionView.prototype.drawDragMaster = function(ctx, pos) {
      var name;
      this.clearHover(ctx);
      if (this.song.master[this.click_pos.y] == null) {
        return;
      }
      name = this.song.master[this.click_pos.y].name;
      if (pos.y >= Math.max(this.song.length, 10)) {
        return;
      }
      ctx.strokeStyle = this.color[1];
      ctx.fillStyle = this.color[1];
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      ctx.fillText(name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w, this.h);
      return this.hover_pos = pos;
    };

    SessionView.prototype.drawHover = function(ctx, pos) {
      this.clearHover(ctx);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w, this.h);
      return this.hover_pos = pos;
    };

    SessionView.prototype.clearHover = function(ctx) {
      if (ctx === this.ctx_tracks_hover) {
        ctx.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w + 2, this.h + 2);
        if (this.hover_pos.x === this.select_pos.x && this.hover_pos.y === this.select_pos.y) {
          return this.selectCell(this.select_pos);
        }
      } else {
        ctx.clearRect(0, this.hover_pos.y * this.h, this.w + 2, this.h + 2);
        if (this.hover_pos.x === this.select_pos.x && this.hover_pos.y === this.select_pos.y) {
          return this.selectCellMaster(this.select_pos);
        }
      }
    };

    SessionView.prototype.clearActive = function(x) {
      return this.ctx_tracks_on.clearRect(x * this.w, this.last_active[x] * this.h, this.w, this.h);
    };

    SessionView.prototype.clearAllActive = function() {
      this.ctx_tracks_on.clearRect(0, 0, 10000, 10000);
      return this.ctx_master_on.clearRect(0, 0, 10000, 10000);
    };

    SessionView.prototype.cueTracks = function(x, y) {
      var _this = this;
      if ((this.song.tracks[x] != null) && (this.song.tracks[x].patterns[y] != null)) {
        this.model.cuePattern(x, y);
        this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 4, y * this.h + 4, 15, 16);
        return window.setTimeout((function() {
          return _this.ctx_tracks_on.clearRect(x * _this.w + 4, y * _this.h + 4, 15, 16);
        }), 100);
      }
    };

    SessionView.prototype.cueMaster = function(x, y) {
      var _this = this;
      if (this.song.master[y] != null) {
        this.model.cueScene(y);
        this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, 4, y * this.h + 4, 15, 16);
        return window.setTimeout((function() {
          return _this.ctx_master_on.clearRect(4, y * _this.h + 4, 15, 16);
        }), 100);
      }
    };

    SessionView.prototype.beat = function(is_master, cells) {
      var c, _i, _len, _results,
        _this = this;
      if (is_master) {
        c = cells;
        this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
        return window.setTimeout((function() {
          return _this.ctx_master_on.clearRect(c[0] * _this.w + 3, c[1] * _this.h + 3, 16, 15);
        }), 100);
      } else {
        _results = [];
        for (_i = 0, _len = cells.length; _i < _len; _i++) {
          c = cells[_i];
          this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
          _results.push(window.setTimeout((function() {
            return _this.ctx_tracks_on.clearRect(c[0] * _this.w + 3, c[1] * _this.h + 3, 16, 15);
          }), 100));
        }
        return _results;
      }
    };

    SessionView.prototype.editPattern = function(pos) {
      var pat;
      pat = this.model.editPattern(pos.x, pos.y);
      return this.drawCell(this.ctx_tracks, pat[2], pat[0], pat[1]);
    };

    SessionView.prototype.addSynth = function(song) {
      this.song = song;
      return this.readSong(this.song, this.current_cells);
    };

    SessionView.prototype.showSuccess = function(_url, song_title, user_name) {
      var fb_url, text, title, tw_url, url,
        _this = this;
      if (song_title != null) {
        if (user_name != null) {
          text = '"' + song_title + '" by ' + user_name;
        } else {
          text = '"' + song_title + '"';
        }
        title = text + ' :: evil';
      } else {
        text = '"evil" by gmork';
        title = 'evil';
      }
      url = 'http://evil.gmork.in/' + _url;
      history.pushState('', title, _url);
      document.title = title;
      this.dialog.css({
        opacity: '1',
        'z-index': '10000'
      });
      this.dialog.find('#dialog-socials').show();
      this.dialog.find('#dialog-success').show();
      this.dialog.find('#dialog-error').hide();
      this.dialog.find('.dialog-message-sub').text(url);
      tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil');
      fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
      this.dialog.find('.dialog-twitter').attr('href', tw_url).click(function() {
        return _this.closeDialog();
      });
      return this.dialog.find('.dialog-facebook').attr('href', fb_url).click(function() {
        return _this.closeDialog();
      });
    };

    SessionView.prototype.showError = function(error) {
      this.dialog.css({
        opacity: '1',
        'z-index': '10000'
      });
      this.dialog.find('#dialog-socials').hide();
      this.dialog.find('#dialog-success').hide();
      return this.dialog.find('#dialog-error').show();
    };

    SessionView.prototype.closeDialog = function() {
      return this.dialog.css({
        opacity: '1',
        'z-index': '-10000'
      });
    };

    SessionView.prototype.share = function(service) {
      var fb_url, hb_url, text, title, tw_url, url;
      if (this.song.title != null) {
        if (this.song.creator != null) {
          text = '"' + this.song.title + '" by ' + this.song.creator;
        } else {
          text = '"' + this.song.title + '"';
        }
        title = text + ' :: evil';
      } else {
        text = '"evil" by gmork';
        title = 'evil';
      }
      url = location.href;
      if (service === 'twitter') {
        tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil');
        return window.open(tw_url, 'Tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
      } else if (service === 'facebook') {
        fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
        return window.open(fb_url, 'Share on facebook', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
      } else {
        hb_url = 'http://b.hatena.ne.jp/entry/' + url.split('://')[1];
        return window.open(hb_url);
      }
    };

    SessionView.prototype.changeSynth = function(id, type) {};

    SessionView.prototype.copyCell = function(src, dst) {
      if (this.song.tracks[src.x] == null) {
        return;
      }
      if (this.song.tracks[src.x].patterns[src.y] == null) {
        return;
      }
      this.model.savePattern(src.x, src.y);
      if (this.song.tracks[dst.x] == null) {
        dst.x = this.model.readTrack(this.song, src, dst);
        this.current_cells.length = dst.x + 1;
        this.song.tracks[dst.x].type = this.song.tracks[src.x].type;
      }
      if (this.song.tracks[src.x].type !== this.song.tracks[dst.x].type) {
        return;
      }
      this.song.tracks[dst.x].patterns[dst.y] = $.extend(true, {}, this.song.tracks[src.x].patterns[src.y]);
      this.drawCell(this.ctx_tracks, this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
      this.model.readPattern(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
      return this.drawCell(this.ctx_master, this.song.master[dst.y], 0, dst.y);
    };

    SessionView.prototype.copyCellMaster = function(src, dst) {
      if (this.song.master[src.y] == null) {
        return;
      }
      this.song.master[dst.y] = $.extend(true, {}, this.song.master[src.y]);
      this.drawCell(this.ctx_master, this.song.master[dst.x], 0, dst.y);
      return this.model.readMaster(this.song.master[dst.y], dst.y);
    };

    SessionView.prototype.selectCell = function(pos) {
      if (this.song.tracks[pos.x] == null) {
        return;
      }
      if (this.song.tracks[pos.x].patterns[pos.y] == null) {
        return;
      }
      this.ctx_master_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      this.ctx_tracks_hover.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w, this.h);
      this.ctx_tracks_hover.clearRect(this.click_pos.x * this.w, this.click_pos.y * this.h, this.w, this.h);
      this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      if (this.track_color[pos.x] == null) {
        this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
      }
      this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][5];
      this.ctx_tracks_hover.fillRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][1];
      this.ctx_tracks_hover.fillText(this.song.tracks[pos.x].patterns[pos.y].name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      this.select_pos = pos;
      return this.select_pos.type = 'tracks';
    };

    SessionView.prototype.selectCellMaster = function(pos) {
      if (this.song.master[pos.y] == null) {
        return;
      }
      this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      this.ctx_master_hover.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w, this.h);
      this.ctx_master_hover.clearRect(this.click_pos.x * this.w, this.click_pos.y * this.h, this.w, this.h);
      this.ctx_master_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      this.ctx_master_hover.fillStyle = this.color[5];
      this.ctx_master_hover.fillRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      this.ctx_master_hover.fillStyle = this.color[1];
      this.ctx_master_hover.fillText(this.song.master[pos.y].name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      this.select_pos = pos;
      return this.select_pos.type = 'master';
    };

    return SessionView;

  })();

}).call(this);
