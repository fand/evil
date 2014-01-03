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
          lofi: parseFloat(_this.lofi.val()) / 100.0
        });
      });
    };

    return DelayView;

  })();

}).call(this);
