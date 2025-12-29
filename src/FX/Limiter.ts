class Limiter {
  // DON'T NEED to extend FX
  ctx: AudioContext;
  in: DynamicsCompressorNode;
  out: DynamicsCompressorNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.in = this.ctx.createDynamicsCompressor();
    this.out = this.ctx.createDynamicsCompressor();

    this.in.connect(this.out);

    this.in.threshold.value = -6;
    this.out.threshold.value = -10;
    this.out.ratio.value = 20;
  }

  connect(dst) {
    return this.out.connect(dst);
  }
}

// Export!
export default Limiter;
