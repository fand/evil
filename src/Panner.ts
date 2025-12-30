export class Panner {
  ctx: AudioContext;
  in: ChannelSplitterNode;
  out: ChannelMergerNode;
  l: GainNode;
  r: GainNode;
  pos: number = 0.5;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.in = this.ctx.createChannelSplitter(2);
    this.out = this.ctx.createChannelMerger(2);
    this.l = this.ctx.createGain();
    this.r = this.ctx.createGain();
    this.in.connect(this.l, 0);
    this.in.connect(this.r, 1);
    this.l.connect(this.out, 0, 0);
    this.r.connect(this.out, 0, 1);
    this.l.gain.value = this.pos;
    this.r.gain.value = 1.0 - this.pos;
  }

  connect(dst: AudioNode) {
    return this.out.connect(dst);
  }

  setPosition(pos: number) {
    this.pos = pos;
    this.l.gain.value = this.pos;
    this.r.gain.value = 1.0 - this.pos;
  }
}
