(function() {
  this.SidebarView = (function() {
    function SidebarView(model) {
      this.model = model;
      this.wrapper = $('#sidebar-wrapper');
      this.tracks = this.wrapper.find('#sidebar-tracks');
      this.master = this.wrapper.find('#sidebar-master');
      this.master_name = this.master.find('[name=name]');
      this.master_bpm = this.master.find('[name=bpm]');
      this.master_key = this.master.find('[name=key]');
      this.master_scale = this.master.find('[name=mode]');
      this.master_save = this.master.find('[name=save]');
      this.initEvent();
    }

    SidebarView.prototype.initEvent = function() {
      var m, _i, _len, _ref,
        _this = this;
      this.master_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.saveMaster();
      }));
      _ref = [this.master_bpm, this.master_key, this.master_scale];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        m.on('focus', (function() {
          return window.keyboard.beginInput();
        })).on('blur', (function() {
          return window.keyboard.endInput();
        }));
      }
      return this.master_save.on('click', (function() {
        return _this.saveMaster();
      }));
    };

    SidebarView.prototype.saveMaster = function() {
      var bpm, key, name, obj, scale;
      name = this.master_name.val();
      bpm = this.master_bpm.val();
      key = this.master_key.val();
      scale = this.master_scale.val();
      obj = {
        name: name != null ? name : void 0,
        bpm: bpm != null ? bpm : void 0,
        key: key != null ? key : void 0,
        scale: scale != null ? scale : void 0
      };
      return this.model.saveMaster(obj);
    };

    SidebarView.prototype.clearMaster = function() {
      var o;
      o = {
        name: this.master_name.val()
      };
      this.model.saveMaster(o);
      return this.showMaster(o);
    };

    SidebarView.prototype.showTracks = function(o) {
      return this.wrapper.css('left', '0px');
    };

    SidebarView.prototype.showMaster = function(o) {
      if (o.name != null) {
        this.master_name.val(o.name);
      }
      if (o.bpm != null) {
        this.master_bpm.val(o.bpm);
      }
      if (o.key != null) {
        this.master_key.val(o.key);
      }
      if (o.scale != null) {
        this.master_scale.val(o.scale);
      }
      return this.wrapper.css('left', '-141px');
    };

    return SidebarView;

  })();

}).call(this);
