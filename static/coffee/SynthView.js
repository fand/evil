(function() {
  this.SynthView = (function() {
    function SynthView(model, id) {
      var _this = this;
      this.model = model;
      this.id = id;
      this.dom = $('#tmpl_synth').clone();
      this.dom.attr('id', 'synth' + id);
      $("#instruments").append(this.dom);
      this.synth_name = this.dom.find('.synth-name');
      this.synth_name.val(this.model.name);
      this.pattern_name = this.dom.find('.pattern-name');
      this.pattern_name.val(this.model.pattern_name);
      this.synth_type = this.dom.find('.synth-type');
      this.pencil = this.dom.find('.sequencer-pencil');
      this.step = this.dom.find('.sequencer-step');
      this.is_step = false;
      this.header = this.dom.find('.header');
      this.markers = this.dom.find('.markers');
      this.pos_markers = this.dom.find('.marker');
      this.marker_prev = this.dom.find('.marker-prev');
      this.marker_next = this.dom.find('.marker-next');
      this.plus = this.dom.find('.pattern-plus');
      this.minus = this.dom.find('.pattern-minus');
      this.nosync = this.dom.find('.pattern-nosync');
      this.is_nosync = false;
      this.setMarker();
      this.table_wrapper = this.dom.find('.sequencer-table');
      this.canvas_hover_dom = this.dom.find('.table-hover');
      this.canvas_on_dom = this.dom.find('.table-on');
      this.canvas_off_dom = this.dom.find('.table-off');
      this.canvas_hover = this.canvas_hover_dom[0];
      this.canvas_on = this.canvas_on_dom[0];
      this.canvas_off = this.canvas_off_dom[0];
      this.ctx_hover = this.canvas_hover.getContext('2d');
      this.ctx_on = this.canvas_on.getContext('2d');
      this.ctx_off = this.canvas_off.getContext('2d');
      this.cell = new Image();
      this.cell.src = 'static/img/sequencer_cell.png';
      this.cell.onload = function() {
        return _this.initCanvas();
      };
      this.cells_x = 32;
      this.cells_y = 20;
      this.fold = this.dom.find('.btn-fold-core');
      this.core = this.dom.find('.synth-core');
      this.is_panel_opened = true;
      this.keyboard = new KeyboardView(this);
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj = {
        name: this.model.pattern_name,
        pattern: this.pattern
      };
      this.page = 0;
      this.page_total = 1;
      this.last_time = 0;
      this.last_page = 0;
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.initEvent();
    }

    SynthView.prototype.initCanvas = function() {
      var i, j, _i, _j, _ref, _ref1;
      this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = 832;
      this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 520;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = this.cells_x; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.readPattern(this.pattern_obj);
    };

    SynthView.prototype.getPos = function(e) {
      var _x, _y;
      this.rect = this.canvas_off.getBoundingClientRect();
      _x = Math.floor((e.clientX - this.rect.left) / 26);
      _y = Math.floor((e.clientY - this.rect.top) / 26);
      return {
        x: _x,
        y: _y,
        x_abs: this.page * this.cells_x + _x,
        y_abs: _y,
        note: this.cells_y - _y
      };
    };

    SynthView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
          _this.ctx_hover.drawImage(_this.cell, 52, 0, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          if (_this.is_sustaining) {
            _this.sustain_l = Math.min(pos.x_abs, _this.sustain_l);
            _this.sustain_r = Math.max(pos.x_abs, _this.sustain_r);
            _this.sustainNote(_this.sustain_l, _this.sustain_r, pos);
          } else {
            if (_this.is_adding) {
              _this.addNote(pos);
            } else if (_this.pattern[pos.x_abs] === pos.note) {
              _this.removeNote(pos);
            }
          }
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        if (!_this.is_step) {
          if (_this.pattern[pos.x_abs] === 'sustain' || _this.pattern[pos.x_abs] === 'end') {
            _this.addNote(pos);
            _this.sustain_l = _this.sustain_r = pos.x_abs;
            return _this.is_sustaining = true;
          } else {
            _this.addNote(pos);
            _this.sustain_l = _this.sustain_r = pos.x_abs;
            return _this.is_sustaining = true;
          }
        } else {
          if (_this.pattern[pos.x_abs] === pos.note) {
            return _this.removeNote(pos);
          } else {
            _this.is_adding = true;
            return _this.addNote(pos);
          }
        }
      }).on('mouseup', function(e) {
        var pos;
        _this.is_clicked = false;
        if (!_this.is_step) {
          pos = _this.getPos(e);
          return _this.is_sustaining = false;
        } else {
          return _this.is_adding = false;
        }
      }).on('mouseout', function(e) {
        _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        _this.is_clicked = false;
        return _this.is_adding = false;
      });
      this.synth_type.on('change', function() {
        return _this.model.session.changeSynth(_this.id, _this.synth_type.val());
      });
      this.synth_name.on('focus', (function() {
        return window.is_input_mode = true;
      })).on('blur', (function() {
        return window.is_input_mode = false;
      })).on('change', (function() {
        return _this.model.setSynthName(_this.synth_name.val());
      }));
      this.pattern_name.on('focus', (function() {
        return window.is_input_mode = true;
      })).on('blur', (function() {
        return window.is_input_mode = false;
      })).on('change', (function() {
        return _this.model.setPatternName(_this.pattern_name.val());
      }));
      this.pencil.on('click', (function() {
        return _this.pencilMode();
      }));
      this.step.on('click', (function() {
        return _this.stepMode();
      }));
      this.marker_prev.on('click', (function() {
        return _this.model.player.backward(true);
      }));
      this.marker_next.on('click', (function() {
        return _this.model.player.forward();
      }));
      this.nosync.on('click', (function() {
        return _this.toggleNoSync();
      }));
      this.plus.on('click', (function() {
        return _this.plusPattern();
      }));
      this.minus.on('click', (function() {
        if (_this.pattern.length > _this.cells_x) {
          return _this.minusPattern();
        }
      }));
      return this.fold.on('mousedown', function() {
        if (_this.is_panel_opened) {
          _this.core.css('height', '0px');
          _this.table_wrapper.css('height', '524px');
          _this.fold.css({
            top: '-22px',
            padding: '0px 5px 0px 0px'
          }).removeClass('fa-angle-down').addClass('fa-angle-up');
          return _this.is_panel_opened = false;
        } else {
          _this.core.css('height', '280px');
          _this.table_wrapper.css('height', '262px');
          _this.fold.css({
            top: '0px',
            padding: '5px 5px 5px 5px'
          }).removeClass('fa-angle-up').addClass('fa-angle-down');
          return _this.is_panel_opened = true;
        }
      });
    };

    SynthView.prototype.addNote = function(pos) {
      var i, y;
      if (this.pattern[pos.x_abs] === 'end' || this.pattern[pos.x_abs] === 'sustain') {
        i = pos.x_abs - 1;
        while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
          i--;
        }
        this.ctx_on.clearRect(((pos.x_abs - 1) % this.cells_x) * 26, 0, 26, 1000);
        y = this.cells_y + this.pattern[i];
        if (this.pattern[pos.x_abs - 1] < 0) {
          this.pattern[pos.x_abs - 1] = -this.pattern[pos.x_abs - 1];
          this.ctx_on.drawImage(this.cell, 0, 0, 26, 26, ((pos.x_abs - 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[pos.x_abs - 1] = 'end';
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, ((pos.x_abs - 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      i = pos.x_abs + 1;
      while (this.pattern[i] === 'end' || this.pattern[i] === 'sustain') {
        this.pattern[i] = 0;
        i++;
      }
      this.ctx_on.clearRect(pos.x * 26, 0, (i - pos.x_abs) * 26, 1000);
      this.pattern[pos.x_abs] = pos.note;
      this.model.addNote(pos.x_abs, pos.note);
      this.ctx_on.clearRect(pos.x * 26, 0, 26, 1000);
      return this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
    };

    SynthView.prototype.removeNote = function(pos) {
      this.pattern[pos.x_abs] = 0;
      this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
      return this.model.removeNote(pos.x_abs);
    };

    SynthView.prototype.sustainNote = function(l, r, pos) {
      var i, y, _i, _j, _ref;
      if (l === r) {
        this.addNote(pos);
        return;
      }
      for (i = _i = l; l <= r ? _i <= r : _i >= r; i = l <= r ? ++_i : --_i) {
        this.ctx_on.clearRect((i % this.cells_x) * 26, 0, 26, 1000);
      }
      for (i = _j = _ref = l + 1; _ref <= r ? _j < r : _j > r; i = _ref <= r ? ++_j : --_j) {
        this.pattern[i] = 'sustain';
        this.ctx_on.drawImage(this.cell, 130, 0, 26, 26, (i % this.cells_x) * 26, pos.y * 26, 26, 26);
      }
      if (this.pattern[l] === 'sustain' || this.pattern[l] === 'end') {
        i = l - 1;
        while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
          i--;
        }
        this.ctx_on.clearRect(((l - 1) % this.cells_x) * 26, 0, 26, 1000);
        y = this.cells_y + this.pattern[i];
        if (this.pattern[l - 1] < 0) {
          this.pattern[l - 1] = -this.pattern[l - 1];
          this.ctx_on.drawImage(this.cell, 0, 0, 26, 26, ((l - 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[l - 1] = 'end';
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, ((l - 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      if (this.pattern[r] < 0) {
        y = this.cells_y + this.pattern[r];
        if (this.pattern[r + 1] === 'end') {
          this.pattern[r + 1] = -this.pattern[r];
          this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, ((r + 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[r + 1] = this.pattern[r];
          this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, ((r + 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      this.pattern[l] = -pos.note;
      this.pattern[r] = 'end';
      this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, (l % this.cells_x) * 26, pos.y * 26, 26, 26);
      this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, (r % this.cells_x) * 26, pos.y * 26, 26, 26);
      return this.model.sustainNote(l, r, pos.note);
    };

    SynthView.prototype.endSustain = function(time) {
      if (this.is_sustaining) {
        if (this.pattern[time - 1] === 'sustain') {
          this.pattern[time - 1] = 'end';
        } else {
          this.pattern[time - 1] *= -1;
        }
        return this.is_sustaining = false;
      }
    };

    SynthView.prototype.playAt = function(time) {
      var i, _i, _ref;
      this.time = time;
      if (this.is_nosync) {
        return;
      }
      if (this.time % this.cells_x === 0) {
        this.endSustain();
        this.drawPattern(this.time);
      }
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26);
        this.ctx_off.drawImage(this.cell, 78, 0, 26, 26, (time % this.cells_x) * 26, i * 26, 26, 26);
      }
      return this.last_time = time;
    };

    SynthView.prototype.readPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.page = 0;
      this.page_total = this.pattern.length / this.cells_x;
      this.drawPattern(0);
      this.setMarker();
      return this.setPatternName(this.pattern_obj.name);
    };

    SynthView.prototype.drawPattern = function(time) {
      var i, last_y, note, y, _i, _ref;
      if (time != null) {
        this.time = time;
      }
      this.page = Math.floor(this.time / this.cells_x);
      this.ctx_on.clearRect(0, 0, 832, 520);
      last_y = 0;
      for (i = _i = 0, _ref = this.cells_x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        note = this.pattern[this.page * this.cells_x + i];
        if (note === 'sustain') {
          this.ctx_on.drawImage(this.cell, 130, 0, 26, 26, i * 26, last_y * 26, 26, 26);
        } else if (note === 'end') {
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, i * 26, last_y * 26, 26, 26);
          last_y = 0;
        } else if (note < 0) {
          y = this.cells_y + note;
          this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, i * 26, y * 26, 26, 26);
          last_y = y;
        } else {
          y = this.cells_y - note;
          this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, i * 26, y * 26, 26, 26);
          last_y = y;
        }
      }
      return this.setMarker();
    };

    SynthView.prototype.plusPattern = function() {
      if (this.page_total === 8) {
        return;
      }
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.page_total++;
      this.model.plusPattern();
      this.drawPattern();
      this.minus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 8) {
        return this.plus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SynthView.prototype.minusPattern = function() {
      if (this.page_total === 1) {
        return;
      }
      this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
      this.page_total--;
      this.model.minusPattern();
      this.drawPattern();
      this.plus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 1) {
        return this.minus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SynthView.prototype.setMarker = function() {
      var _this = this;
      this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).addClass('marker-active');
      this.pos_markers.filter(function(i) {
        return _this.page_total <= i;
      }).removeClass('marker-active');
      this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now');
      this.markers.find('.marker-pos').text(this.page + 1);
      this.markers.find('.marker-total').text(this.page_total);
      return this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).each(function(i) {
        return _this.pos_markers.eq(i).on('mousedown', function() {
          var _results;
          if (_this.page < i) {
            while (_this.page !== i) {
              _this.model.player.forward();
            }
          }
          if (_this.page > i) {
            _results = [];
            while (_this.page !== i) {
              _results.push(_this.model.player.backward(true));
            }
            return _results;
          }
        });
      });
    };

    SynthView.prototype.play = function() {};

    SynthView.prototype.stop = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26));
      }
      return _results;
    };

    SynthView.prototype.activate = function(i) {
      this.is_active = true;
      return this.initCanvas();
    };

    SynthView.prototype.inactivate = function() {
      return this.is_active = false;
    };

    SynthView.prototype.setSynthName = function(name) {
      return this.synth_name.val(name);
    };

    SynthView.prototype.setPatternName = function(name) {
      this.pattern_name.val(name);
      return this.pattern_obj.name = name;
    };

    SynthView.prototype.toggleNoSync = function() {
      var i, _i, _ref, _results;
      if (this.is_nosync) {
        this.is_nosync = false;
        this.nosync.removeClass('btn-true').addClass('btn-false');
        return this.drawPattern(this.time);
      } else {
        this.is_nosync = true;
        this.nosync.removeClass('btn-false').addClass('btn-true');
        _results = [];
        for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.time % this.cells_x) * 26, i * 26, 26, 26));
        }
        return _results;
      }
    };

    SynthView.prototype.pencilMode = function() {
      this.is_step = false;
      this.pencil.removeClass('btn-false').addClass('btn-true');
      return this.step.removeClass('btn-true').addClass('btn-false');
    };

    SynthView.prototype.stepMode = function() {
      this.is_step = true;
      this.step.removeClass('btn-false').addClass('btn-true');
      return this.pencil.removeClass('btn-true').addClass('btn-false');
    };

    return SynthView;

  })();

  this.KeyboardView = (function() {
    function KeyboardView(sequencer) {
      this.sequencer = sequencer;
      this.dom = this.sequencer.dom.find('.keyboard');
      this.canvas = this.dom[0];
      this.ctx = this.canvas.getContext('2d');
      this.w = 48;
      this.h = 26;
      this.num = 20;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.initCanvas();
      this.initEvent();
    }

    KeyboardView.prototype.initCanvas = function() {
      var i, _i, _ref, _results;
      this.canvas.width = this.w;
      this.canvas.height = this.h * this.num;
      this.rect = this.canvas.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      this.ctx.fillStyle = this.color[0];
      _results = [];
      for (i = _i = 0, _ref = this.num; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.drawNormal(i);
        _results.push(this.drawText(i));
      }
      return _results;
    };

    KeyboardView.prototype.getPos = function(e) {
      this.rect = this.canvas.getBoundingClientRect();
      return Math.floor((e.clientY - this.rect.top) / this.h);
    };

    KeyboardView.prototype.initEvent = function() {
      var _this = this;
      return this.dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.drawNormal(_this.hover_pos);
          _this.drawHover(pos);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          _this.clearActive(_this.click_pos);
          _this.drawActive(pos);
          _this.sequencer.model.noteOff();
          _this.sequencer.model.noteOn(_this.num - pos);
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        _this.drawActive(pos);
        _this.sequencer.model.noteOn(_this.num - pos);
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        _this.clearActive(_this.click_pos);
        _this.sequencer.model.noteOff();
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      }).on('mouseout', function(e) {
        _this.clearActive(_this.hover_pos);
        _this.sequencer.model.noteOff();
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      });
    };

    KeyboardView.prototype.drawNormal = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[0];
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      this.ctx.fillStyle = this.color[3];
      return this.ctx.fillText((this.num - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.drawHover = function(i) {
      this.ctx.fillStyle = this.color[1];
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      return this.ctx.fillText((this.num - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.drawActive = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[2];
      this.ctx.fillRect(0, i * this.h, this.w, this.h);
      this.ctx.fillStyle = this.color[4];
      return this.ctx.fillText((this.num - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.clearNormal = function(i) {
      return this.ctx.clearRect(0, i * this.h, this.w, this.h);
    };

    KeyboardView.prototype.clearActive = function(i) {
      this.clearNormal(i);
      this.drawNormal(i);
      return this.drawText(i);
    };

    KeyboardView.prototype.drawText = function(i) {
      this.ctx.fillStyle = this.color[3];
      return this.ctx.fillText((this.num - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    return KeyboardView;

  })();

}).call(this);
