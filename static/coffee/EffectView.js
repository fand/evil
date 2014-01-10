(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FXView = (function() {
    function FXView(model, dom) {
      var _this = this;
      this.model = model;
      this.dom = dom;
      this.minus = this.dom.find('.sidebar-effect-minus');
      this.minus.on('click', function() {
        _this.model.remove();
        return $(_this.dom).remove();
      });
    }

    return FXView;

  })();

  this.ReverbView = (function(_super) {
    __extends(ReverbView, _super);

    function ReverbView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_reverb').clone();
      this.dom.removeAttr('id');
      ReverbView.__super__.constructor.call(this, this.model, this.dom);
      this.name = this.dom.find('[name=name]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    ReverbView.prototype.initEvent = function() {
      var _this = this;
      this.name.on('change', function() {
        return _this.model.setIR(_this.name.val());
      });
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      return this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
    };

    ReverbView.prototype.readParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.name != null) {
        return this.name.val(p.name);
      }
    };

    return ReverbView;

  })(this.FXView);

  this.DelayView = (function(_super) {
    __extends(DelayView, _super);

    function DelayView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_delay').clone();
      this.dom.removeAttr('id');
      DelayView.__super__.constructor.call(this, this.model, this.dom);
      this.delay = this.dom.find('[name=delay]');
      this.feedback = this.dom.find('[name=feedback]');
      this.lofi = this.dom.find('[name=lofi]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    DelayView.prototype.initEvent = function() {
      var _this = this;
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.delay.on('change', function() {
        return _this.model.setParam({
          delay: parseFloat(_this.delay.val()) / 1000.0
        });
      });
      this.feedback.on('change', function() {
        return _this.model.setParam({
          feedback: parseFloat(_this.feedback.val()) / 100.0
        });
      });
      return this.lofi.on('change', function() {
        return _this.model.setParam({
          lofi: parseFloat(_this.lofi.val()) * 5.0 / 100.0
        });
      });
    };

    DelayView.prototype.readParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.delays != null) {
        this.delay.val(p.delay * 1000);
      }
      if (p.feedback != null) {
        this.feedback.val(p.feedback * 100);
      }
      if (p.lofi != null) {
        return this.lofi.val(p.lofi * 20);
      }
    };

    return DelayView;

  })(this.FXView);

  this.CompressorView = (function(_super) {
    __extends(CompressorView, _super);

    function CompressorView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_compressor').clone();
      this.dom.removeAttr('id');
      CompressorView.__super__.constructor.call(this, this.model, this.dom);
      this.attack = this.dom.find('[name=attack]');
      this.release = this.dom.find('[name=release]');
      this.threshold = this.dom.find('[name=threshold]');
      this.ratio = this.dom.find('[name=ratio]');
      this.knee = this.dom.find('[name=knee]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    CompressorView.prototype.initEvent = function() {
      var _this = this;
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.attack.on('change', function() {
        return _this.model.setParam({
          attack: parseFloat(_this.attack.val()) / 1000.0
        });
      });
      this.release.on('change', function() {
        return _this.model.setParam({
          release: parseFloat(_this.release.val()) / 1000.0
        });
      });
      this.threshold.on('change', function() {
        return _this.model.setParam({
          threshold: parseFloat(_this.threshold.val()) / -10.0
        });
      });
      this.ratio.on('change', function() {
        return _this.model.setParam({
          ratio: parseInt(_this.ratio.val())
        });
      });
      return this.knee.on('change', function() {
        return _this.model.setParam({
          knee: parseFloat(_this.knee.val()) / 1000.0
        });
      });
    };

    CompressorView.prototype.readParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.attacks != null) {
        this.attack.val(p.attack * 1000);
      }
      if (p.release != null) {
        this.release.val(p.release * 1000);
      }
      if (p.threshold != null) {
        this.threshold.val(p.threshold * -10);
      }
      if (p.ratio != null) {
        this.ratio.val(p.ratio);
      }
      if (p.knee != null) {
        return this.knee.val(p.knee * 1000);
      }
    };

    return CompressorView;

  })(this.FXView);

  this.FuzzView = (function(_super) {
    __extends(FuzzView, _super);

    function FuzzView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_fuzz').clone();
      this.dom.removeAttr('id');
      FuzzView.__super__.constructor.call(this, this.model, this.dom);
      this.type = this.dom.find('[name=type]');
      this.gain = this.dom.find('[name=gain]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    FuzzView.prototype.initEvent = function() {
      var _this = this;
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.type.on('change', function() {
        return _this.model.setParam({
          type: _this.type.val()
        });
      });
      return this.gain.on('change', function() {
        return _this.model.setParam({
          gain: parseFloat(_this.gain.val()) / 100.0
        });
      });
    };

    FuzzView.prototype.readParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.type != null) {
        this.type.val(p.type);
      }
      if (p.gain != null) {
        return this.gain.val(p.gain * 100);
      }
    };

    return FuzzView;

  })(this.FXView);

  this.DoubleView = (function(_super) {
    __extends(DoubleView, _super);

    function DoubleView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_double').clone();
      this.dom.removeAttr('id');
      DoubleView.__super__.constructor.call(this, this.model, this.dom);
      this.delay = this.dom.find('[name=delay]');
      this.width = this.dom.find('[name=width]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    DoubleView.prototype.initEvent = function() {
      var _this = this;
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.delay.on('change', function() {
        return _this.model.setParam({
          delay: parseFloat(_this.delay.val()) / 1000.0
        });
      });
      return this.width.on('change', function() {
        return _this.model.setParam({
          width: parseFloat(_this.width.val()) / 200.0 + 0.5
        });
      });
    };

    DoubleView.prototype.readParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.delay != null) {
        this.delay.val(p.delay * 1000);
      }
      if (p.width != null) {
        return this.width.val((p.width - 0.5) * 200);
      }
    };

    return DoubleView;

  })(this.FXView);

}).call(this);
