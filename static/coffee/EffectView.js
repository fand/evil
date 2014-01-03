(function() {
  this.FXView = (function() {
    function FXView(model) {
      this.model = model;
    }

    return FXView;

  })();

  this.PumpView = (function() {
    function PumpView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_pump').clone();
      this.dom.removeAttr('id');
      this.initEvent();
    }

    PumpView.prototype.initEvent = function() {
      var _this = this;
      return this.dom.on('change', function() {
        return _this.setParam();
      });
    };

    PumpView.prototype.setParam = function() {
      return this.model.setParam({
        gain: parseFloat(this.dom.find('[name=gain]').val())
      });
    };

    return PumpView;

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
      this.name = this.dom.find('[name=name]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    DelayView.prototype.initEvent = function() {
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

    return DelayView;

  })();

}).call(this);
