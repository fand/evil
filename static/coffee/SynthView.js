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
      this.header = this.dom.find('.header');
      this.pos_markers = this.dom.find('.marker');
      this.plus = this.dom.find('.pattern-plus');
      this.minus = this.dom.find('.pattern-minus');
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
      this.fold = this.dom.find('.btn-fold-core');
      this.core = this.dom.find('.synth-core');
      this.is_panel_opened = true;
      this.keyboard = new KeyboardView(this);
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
      var i, j, _i, _j;
      this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = 832;
      this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 520;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      for (i = _i = 0; _i < 20; i = ++_i) {
        for (j = _j = 0; _j < 32; j = ++_j) {
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
        x_abs: this.page * 32 + _x,
        y_abs: _y
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
          if (_this.is_adding) {
            _this.addNote(pos);
          } else if (_this.pattern[pos.x_abs] === 20 - pos.y) {
            _this.removeNote(pos);
          }
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        if (_this.pattern[pos.x_abs] === 20 - pos.y) {
          return _this.removeNote(pos);
        } else {
          _this.is_adding = true;
          return _this.addNote(pos);
        }
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        return _this.is_adding = false;
      }).on('mouseout', function(e) {
        _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        _this.is_clicked = false;
        return _this.is_adding = false;
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
      this.plus.on('click', (function() {
        return _this.plusPattern();
      }));
      this.minus.on('click', (function() {
        if (_this.pattern.length > 32) {
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
      var note;
      note = 20 - pos.y;
      this.pattern[pos.x_abs] = note;
      this.model.addNote(pos.x_abs, note);
      this.ctx_on.clearRect(pos.x * 26, 0, 26, 1000);
      return this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
    };

    SynthView.prototype.removeNote = function(pos) {
      this.pattern[pos.x_abs] = 0;
      this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
      return this.model.removeNote(pos.x_abs);
    };

    SynthView.prototype.playAt = function(time) {
      var i, _i;
      this.time = time;
      if (this.time % 32 === 0) {
        this.drawPattern(this.time);
      }
      for (i = _i = 0; _i < 20; i = ++_i) {
        this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % 32) * 26, i * 26, 26, 26);
        this.ctx_off.drawImage(this.cell, 78, 0, 26, 26, (time % 32) * 26, i * 26, 26, 26);
      }
      return this.last_time = time;
    };

    SynthView.prototype.readPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.page = 0;
      this.page_total = this.pattern.length / 32;
      this.drawPattern(0);
      this.setMarker();
      return this.setPatternName(this.pattern_obj.name);
    };

    SynthView.prototype.drawPattern = function(time) {
      var i, y, _i;
      if (time != null) {
        this.time = time;
      }
      this.page = Math.floor(this.time / 32);
      this.ctx_on.clearRect(0, 0, 832, 520);
      for (i = _i = 0; _i < 32; i = ++_i) {
        y = 20 - this.pattern[this.page * 32 + i];
        this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, i * 26, y * 26, 26, 26);
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
      return this.drawPattern();
    };

    SynthView.prototype.minusPattern = function() {
      if (this.page_total === 1) {
        return;
      }
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      this.page_total--;
      this.model.minusPattern();
      return this.drawPattern();
    };

    SynthView.prototype.setMarker = function() {
      var _this = this;
      this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).show();
      this.pos_markers.filter(function(i) {
        return _this.page_total <= i;
      }).hide();
      return this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now');
    };

    SynthView.prototype.play = function() {};

    SynthView.prototype.stop = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i < 20; i = ++_i) {
        _results.push(this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % 32) * 26, i * 26, 26, 26));
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
      return this.pattern_name.val(name);
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
