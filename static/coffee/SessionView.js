(function() {
  this.SessionView = (function() {
    function SessionView(model) {
      this.model = model;
      this.canvas_tracks_dom = $('#session-tracks');
      this.canvas_master_dom = $('#session-master');
      this.canvas_tracks = this.canvas_tracks_dom[0];
      this.canvas_master = this.canvas_master_dom[0];
      this.ctx_tracks = this.canvas_tracks.getContext('2d');
      this.ctx_master = this.canvas_master.getContext('2d');
      this.w = 80;
      this.h = 20;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.initCanvas();
    }

    SessionView.prototype.initCanvas = function() {
      this.canvas_tracks.width = this.w * 8;
      this.canvas_master.width = this.w;
      this.canvas_tracks.height = this.canvas_master.height = this.h * 15 + 10;
      this.ctx_tracks.translate(0, 20);
      this.ctx_master.translate(0, 20);
      this.rect = this.canvas_tracks.getBoundingClientRect();
      return this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
    };

    SessionView.prototype.readSong = function(song) {
      var t, x, y, _i, _j, _k, _ref, _ref1, _ref2, _results;
      for (x = _i = 0, _ref = Math.max(song.tracks.length, 8); 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
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
      _results = [];
      for (y = _k = 0, _ref2 = Math.max(song.master.length, 10); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
        if (song.master[y] != null) {
          _results.push(this.drawCell(this.ctx_master, song.master[y], 0, y));
        } else {
          _results.push(this.drawEmpty(this.ctx_master, 0, y));
        }
      }
      return _results;
    };

    SessionView.prototype.drawCell = function(ctx, p, x, y) {
      this.clearCell(ctx, x, y);
      ctx.fillStyle = this.color[2];
      ctx.fillRect(x * this.w, y * this.h, this.w, this.h);
      ctx.fillStyle = this.color[4];
      return ctx.fillText(p.name, x * this.w, (y + 1) * this.h - 3);
    };

    SessionView.prototype.drawEmpty = function(ctx, x, y) {
      this.clearCell(ctx, x, y);
      ctx.strokeStyle = this.color[0];
      return ctx.strokeRect(x * this.w, y * this.h, this.w, this.h);
    };

    SessionView.prototype.clearCell = function(ctx, x, y) {
      return ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    };

    SessionView.prototype.drawTrackName = function(ctx, name, x) {
      ctx.fillStyle = this.color[2];
      return ctx.fillText(name, x * this.w + 20, 5);
    };

    return SessionView;

  })();

}).call(this);
