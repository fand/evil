(function() {
  var Mixer;

  Mixer = (function() {
    function Mixer(ctx) {
      this.ctx = ctx;
      this.view = new MixerView(this);
    }

    return Mixer;

  })();

}).call(this);
