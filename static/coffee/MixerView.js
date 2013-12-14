(function() {
  var MixerView;

  MixerView = (function() {
    function MixerView() {
      this.dom = $('#mixer');
      this.canvas_session_dom = $('#mixer-session');
      this.canvas_mixer_dom = $('#mixer-mixer');
      this.canvas_session = this.canvas_session_dom[0];
      this.canvas_mixer = this.canvas_mixer_dom[0];
      this.ctx_session = this.canvas_session.getContext('2d');
      this.ctx_mixer = this.canvas_mixer.getContext('2d');
    }

    MixerView.prototype.initCanvas = function() {
      var i, j, _i, _j;
      this.canvas_session.width = this.canvas_mixer.width = 832;
      this.canvas_session.height = this.canvas_mixer.height = 260;
      this.rect = this.canvas_session.getBoundingClientRect();
      for (i = _i = 0; _i < 10; i = ++_i) {
        for (j = _j = 0; _j < 32; j = ++_j) {
          this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.readPattern(this.pattern);
    };

    return MixerView;

  })();

}).call(this);
