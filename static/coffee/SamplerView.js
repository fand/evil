(function() {
  this.SamplerCoreView = (function() {
    function SamplerCoreView(model, id, dom) {
      this.model = model;
      this.id = id;
      this.dom = dom;
      this.sample = this.dom.find('.Sampler_sample');
      this.canvas_waveform_dom = this.dom.find('.waveform');
      this.canvas_waveform = this.canvas_waveform_dom[0];
      this.ctx_waveform = this.canvas_waveform.getContext('2d');
      this.canvas_EQ_dom = this.dom.find('.canvasEQ');
      this.canvas_EQ = this.canvas_EQ_dom[0];
      this.ctx_EQ = this.canvas_EQ.getContext('2d');
      this.eq = this.dom.find('.Sampler_EQ');
      this.output = this.dom.find('.Sampler_output');
      this.panner = this.output.find('.pan-slider');
      this.gain = this.output.find('.gain-slider');
      this.sample_now = 0;
      this.initEvent();
      this.updateEQCanvas();
    }

    SamplerCoreView.prototype.initEvent = function() {
      var _this = this;
      this.sample.on("change", function() {
        _this.setSampleParam();
        return _this.updateWaveformCanvas(_this.sample_now);
      });
      this.eq.on('change', function() {
        _this.setSampleEQParam();
        return _this.updateEQCanvas();
      });
      this.output.on('change', function() {
        return _this.setSampleOutputParam();
      });
      return this.setParam();
    };

    SamplerCoreView.prototype.bindSample = function(sample_now) {
      this.sample_now = sample_now;
      this.updateWaveformParam(this.sample_now);
      return this.updateEQCanvas();
    };

    SamplerCoreView.prototype.updateWaveformCanvas = function(sample_now) {
      var canvas, ctx, d, h, hts, left, right, w, wave, x, _data, _i;
      this.sample_now = sample_now;
      canvas = this.canvas_waveform;
      ctx = this.ctx_waveform;
      w = canvas.width = 300;
      h = canvas.height = 180;
      ctx.clearRect(0, 0, w, h);
      hts = this.model.getSampleParam(this.sample_now);
      _data = this.model.getSampleData(this.sample_now);
      if (_data != null) {
        wave = _data.getChannelData(0);
        ctx.translate(0, 90);
        ctx.beginPath();
        d = wave.length / w;
        for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
          ctx.lineTo(x, wave[Math.floor(x * d)] * h * 0.45);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgb(255, 0, 220)';
        ctx.stroke();
        ctx.translate(0, -90);
      }
      left = hts[0] * w;
      right = hts[1] * w;
      if (left < right) {
        ctx.fillStyle = 'rgba(255, 0, 160, 0.2)';
        return ctx.fillRect(left, 0, right - left, h);
      }
    };

    SamplerCoreView.prototype.updateEQCanvas = function() {
      var canvas, ctx, eq, h, w;
      canvas = this.canvas_EQ;
      ctx = this.ctx_EQ;
      w = canvas.width = 270;
      h = canvas.height = 100;
      eq = this.model.getSampleEQParam(this.sample_now);
      ctx.clearRect(0, 0, w, h);
      ctx.translate(0, h / 2);
      ctx.beginPath();
      ctx.moveTo(0, -(eq[0] / 100.0) * (h / 2));
      ctx.lineTo(w / 3, -(eq[1] / 100.0) * (h / 2));
      ctx.lineTo(w / 3 * 2, -(eq[1] / 100.0) * (h / 2));
      ctx.lineTo(w, -(eq[2] / 100.0) * (h / 2));
      ctx.strokeStyle = 'rgb(255, 0, 220)';
      ctx.stroke();
      ctx.closePath();
      return ctx.translate(0, -h / 2);
    };

    SamplerCoreView.prototype.setParam = function() {};

    SamplerCoreView.prototype.setSampleParam = function() {
      return this.model.setSampleParam(this.sample_now, parseFloat(this.sample.find('.head').val()) / 100.0, parseFloat(this.sample.find('.tail').val()) / 100.0, parseFloat(this.sample.find('.speed').val()) / 100.0);
    };

    SamplerCoreView.prototype.setSampleEQParam = function() {
      return this.model.setSampleEQParam(this.sample_now, parseFloat(this.eq.find('.EQ_lo').val()) - 100.0, parseFloat(this.eq.find('.EQ_mid').val()) - 100.0, parseFloat(this.eq.find('.EQ_hi').val()) - 100.0);
    };

    SamplerCoreView.prototype.setSampleOutputParam = function() {
      return this.model.setSampleOutputParam(this.sample_now, this.pan2pos(1.0 - (parseFloat(this.panner.val()) / 100.0)), parseFloat(this.gain.val()) / 100.0);
    };

    SamplerCoreView.prototype.readSampleParam = function(p) {
      this.sample.find('.head').val(p[0] * 100.0);
      this.sample.find('.tail').val(p[1] * 100.0);
      return this.sample.find('.speed').val(p[2] * 100.0);
    };

    SamplerCoreView.prototype.readSampleEQParam = function(p) {
      this.eq.find('.EQ_lo').val(p[0] + 100.0);
      this.eq.find('.EQ_mid').val(p[1] + 100.0);
      return this.eq.find('.EQ_hi').val(p[2] + 100.0);
    };

    SamplerCoreView.prototype.readSampleOutputParam = function(p) {
      var g, pan;
      pan = p[0], g = p[1];
      this.panner.val((1.0 - Math.acos(pan[0]) / Math.PI) * 100.0);
      return this.gain.val(g * 100.0);
    };

    SamplerCoreView.prototype.setGains = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.gain_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.model.setNodeGain(i, parseInt(this.gain_inputs.eq(i).val())));
      }
      return _results;
    };

    SamplerCoreView.prototype.pan2pos = function(v) {
      var theta;
      theta = v * Math.PI;
      return [Math.cos(theta), 0, -Math.sin(theta)];
    };

    return SamplerCoreView;

  })();

  this.SamplerView = (function() {
    function SamplerView(model, id) {
      var _this = this;
      this.model = model;
      this.id = id;
      this.dom = $('#tmpl_sampler').clone();
      this.dom.attr('id', 'sampler' + id);
      $("#instruments").append(this.dom);
      this.synth_name = this.dom.find('.synth-name');
      this.synth_name.val(this.model.name);
      this.pattern_name = this.dom.find('.pattern-name');
      this.pattern_name.val(this.model.pattern_name);
      this.synth_type = this.dom.find('.synth-type');
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
      this.cells_y = 10;
      this.core = this.dom.find('.sampler-core');
      this.keyboard = new SamplerKeyboardView(this);
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj = {
        name: this.pattern_name.val(),
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
      this.initCanvas();
    }

    SamplerView.prototype.initCanvas = function() {
      var i, j, _i, _j, _ref, _ref1;
      this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = 832;
      this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 260;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = this.cells_x; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.readPattern(this.pattern_obj);
    };

    SamplerView.prototype.getPos = function(e) {
      var _x, _y;
      this.rect = this.canvas_off.getBoundingClientRect();
      _x = Math.floor((e.clientX - this.rect.left) / 26);
      _y = Math.floor((e.clientY - this.rect.top) / 26);
      _y = Math.min(9, _y);
      return {
        x: _x,
        y: _y,
        x_abs: this.page * this.cells_x + _x,
        y_abs: _y,
        note: this.cells_y - _y
      };
    };

    SamplerView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
          _this.ctx_hover.drawImage(_this.cell, 52, 26, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          if (_this.is_adding) {
            _this.addNote(pos, 1.0);
          } else {
            _this.removeNote(pos);
          }
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var note, pos, remove, _i, _len, _ref;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        remove = false;
        _ref = _this.pattern[pos.x_abs];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          note = _ref[_i];
          if (note[0] === pos.note) {
            remove = true;
          }
        }
        if (remove) {
          return _this.removeNote(pos);
        } else {
          _this.is_adding = true;
          return _this.addNote(pos, 1.0);
        }
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        _this.is_adding = false;
        return _this.is_removing = false;
      }).on('mouseout', function(e) {
        _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        _this.is_clicked = false;
        _this.is_adding = false;
        return _this.is_removing = false;
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
      return this.minus.on('click', (function() {
        if (_this.pattern.length > _this.cells_x) {
          return _this.minusPattern();
        }
      }));
    };

    SamplerView.prototype.addNote = function(pos, gain) {
      var i, _i, _ref;
      if (this.pattern[pos.x_abs] === 0) {
        this.pattern[pos.x_abs] = [];
      }
      if (!Array.isArray(this.pattern[pos.x_abs])) {
        this.pattern[pos.x_abs] = [[this.pattern[pos.x_abs], 1.0]];
      }
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          this.pattern[pos.x_abs].splice(i, 1);
        }
      }
      this.pattern[pos.x_abs].push([pos.note, gain]);
      this.model.addNote(pos.x_abs, pos.note, gain);
      return this.ctx_on.drawImage(this.cell, 26, 26, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
    };

    SamplerView.prototype.removeNote = function(pos) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          this.pattern[pos.x_abs].splice(i, 1);
        }
      }
      this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
      return this.model.removeNote(pos);
    };

    SamplerView.prototype.playAt = function(time) {
      var i, _i, _ref;
      this.time = time;
      if (this.is_nosync) {
        return;
      }
      if (this.time % this.cells_x === 0) {
        this.drawPattern(this.time);
      }
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26);
        this.ctx_off.drawImage(this.cell, 78, 26, 26, 26, (time % this.cells_x) * 26, i * 26, 26, 26);
      }
      return this.last_time = time;
    };

    SamplerView.prototype.readPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.page = 0;
      this.page_total = this.pattern.length / this.cells_x;
      this.drawPattern(0);
      this.setMarker();
      return this.setPatternName(this.pattern_obj.name);
    };

    SamplerView.prototype.drawPattern = function(time) {
      var i, j, y, _i, _j, _len, _ref, _ref1;
      if (time != null) {
        this.time = time;
      }
      this.page = Math.floor(this.time / this.cells_x);
      this.ctx_on.clearRect(0, 0, 832, 260);
      for (i = _i = 0, _ref = this.cells_x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = this.pattern[this.page * this.cells_x + i];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          j = _ref1[_j];
          y = this.cells_y - j[0];
          this.ctx_on.drawImage(this.cell, 26, 26, 26, 26, i * 26, y * 26, 26, 26);
        }
      }
      return this.setMarker();
    };

    SamplerView.prototype.plusPattern = function() {
      if (this.page_total === 8) {
        return;
      }
      this.pattern = this.pattern.concat([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
      this.page_total++;
      this.model.plusPattern();
      this.drawPattern();
      this.minus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 8) {
        return this.plus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SamplerView.prototype.minusPattern = function() {
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

    SamplerView.prototype.setMarker = function() {
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

    SamplerView.prototype.play = function() {};

    SamplerView.prototype.stop = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26));
      }
      return _results;
    };

    SamplerView.prototype.activate = function(i) {
      this.is_active = true;
      return this.initCanvas();
    };

    SamplerView.prototype.inactivate = function() {
      return this.is_active = false;
    };

    SamplerView.prototype.setSynthName = function(name) {
      return this.synth_name.val(name);
    };

    SamplerView.prototype.setPatternName = function(name) {
      return this.pattern_name.val(name);
    };

    SamplerView.prototype.toggleNoSync = function() {
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
          _results.push(this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.time % this.cells_x) * 26, i * 26, 26, 26));
        }
        return _results;
      }
    };

    SamplerView.prototype.selectSample = function(sample_now) {
      this.sample_now = sample_now;
      return this.model.selectSample(this.sample_now);
    };

    return SamplerView;

  })();

  this.SamplerKeyboardView = (function() {
    function SamplerKeyboardView(sequencer) {
      this.sequencer = sequencer;
      this.dom = this.sequencer.dom.find('.keyboard');
      this.canvas = this.dom[0];
      this.ctx = this.canvas.getContext('2d');
      this.w = 64;
      this.h = 26;
      this.cells_y = 10;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  250, 50, 230, 0.7)', 'rgba(255, 100, 230, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
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

    SamplerKeyboardView.prototype.initCanvas = function() {
      var i, _i, _ref, _results;
      this.canvas.width = this.w;
      this.canvas.height = this.h * this.cells_y;
      this.rect = this.canvas.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      this.ctx.fillStyle = this.color[0];
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.drawNormal(i);
        _results.push(this.drawText(i));
      }
      return _results;
    };

    SamplerKeyboardView.prototype.getPos = function(e) {
      this.rect = this.canvas.getBoundingClientRect();
      return Math.floor((e.clientY - this.rect.top) / this.h);
    };

    SamplerKeyboardView.prototype.initEvent = function() {
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
          _this.sequencer.model.noteOn(_this.cells_y - pos);
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var note, pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        note = _this.cells_y - pos;
        _this.sequencer.selectSample(note - 1);
        _this.drawActive(pos);
        _this.sequencer.model.noteOn(note);
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

    SamplerKeyboardView.prototype.drawNormal = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[0];
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      this.ctx.fillStyle = this.color[3];
      return this.ctx.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.drawHover = function(i) {
      this.ctx.fillStyle = this.color[1];
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      return this.ctx.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.drawActive = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[2];
      this.ctx.fillRect(0, i * this.h, this.w, this.h);
      this.ctx.fillStyle = this.color[4];
      return this.ctx.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.clearNormal = function(i) {
      return this.ctx.clearRect(0, i * this.h, this.w, this.h);
    };

    SamplerKeyboardView.prototype.clearActive = function(i) {
      this.clearNormal(i);
      this.drawNormal(i);
      return this.drawText(i);
    };

    SamplerKeyboardView.prototype.drawText = function(i) {
      this.ctx.fillStyle = this.color[3];
      return this.ctx.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    return SamplerKeyboardView;

  })();

}).call(this);
