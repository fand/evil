(function() {
  this.Panner = (function() {
    function Panner(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createChannelSplitter(2);
      this.out = this.ctx.createChannelMerger(2);
      this.l = this.ctx.createGain();
      this.r = this.ctx.createGain();
      this["in"].connect(this.l, 0);
      this["in"].connect(this.r, 1);
      this.l.connect(this.out, 0, 0);
      this.r.connect(this.out, 0, 1);
      this.setPosition(0.5);
    }

    Panner.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    Panner.prototype.setPosition = function(pos) {
      this.pos = pos;
      this.l.gain.value = this.pos;
      return this.r.gain.value = 1.0 - this.pos;
    };

    return Panner;

  })();

}).call(this);
