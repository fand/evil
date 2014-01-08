(function() {
  this.FXView = (function() {
    function FXView(model) {
      this.model = model;
    }

    return FXView;

  })();

  this.ReverbView = (function() {
    function ReverbView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_reverb').clone();
      this.dom.removeAttr('id');
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

    return ReverbView;

  })();

  this.DelayView = (function() {
    function DelayView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_delay').clone();
      this.dom.removeAttr('id');
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

    return DelayView;

  })();

  this.CompressorView = (function() {
    function CompressorView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_compressor').clone();
      this.dom.removeAttr('id');
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

    return CompressorView;

  })();

  this.FuzzView = (function() {
    function FuzzView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_fuzz').clone();
      this.dom.removeAttr('id');
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

    return FuzzView;

  })();

  this.DoubleView = (function() {
    function DoubleView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_double').clone();
      this.dom.removeAttr('id');
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

    return DoubleView;

  })();

}).call(this);
