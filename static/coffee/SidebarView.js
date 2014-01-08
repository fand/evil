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
      this.master_effects = this.master.find('.sidebar-effects');
      this.add_master = this.master.find('.add-type');
      this.add_master_btn = this.master.find('.add-btn');
      this.tracks_effects = this.tracks.find('.sidebar-effects');
      this.add_tracks = this.tracks.find('.add-type');
      this.add_tracks_btn = this.tracks.find('.add-btn');
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
      this.master_save.on('click', (function() {
        return _this.saveMaster();
      }));
      this.tracks.find('.sidebar-effect').each(function(i) {
        return $(_this).on('change', function() {
          return _this.model.readTracksEffect(i);
        });
      });
      this.add_master_btn.on('click', function() {
        return _this.addMasterEffect(_this.add_master.val());
      });
      return this.add_tracks_btn.on('click', function() {
        _this.addTracksEffect(_this.add_tracks.val());
        return console.log('ok----');
      });
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

    SidebarView.prototype.saveTracksEffect = function() {
      var f, _i, _len, _ref, _results;
      _ref = this.tracks_effects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f.getParam());
      }
      return _results;
    };

    SidebarView.prototype.showTracks = function(track) {
      var f, _i, _len, _ref;
      this.tracks_effects.find('.sidebar-effect').remove();
      _ref = track.effects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        f.appendTo(this.tracks_effects);
      }
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
      return this.wrapper.css('left', '-223px');
    };

    SidebarView.prototype.addMasterEffect = function(name) {
      var fx;
      fx = this.model.addMasterEffect(name);
      return fx.appendTo(this.master_effects);
    };

    SidebarView.prototype.addTracksEffect = function(name) {
      var fx;
      fx = this.model.addTracksEffect(name);
      return fx.appendTo(this.tracks_effects);
    };

    return SidebarView;

  })();

}).call(this);
