import { FX } from './FX';

export type CompressorParams = {
  input: number;
  output: number;
  attack: number;
  release: number;
  threshold: number;
  ratio: number;
  knee: number;
};

export class Compressor extends FX {
  comp: DynamicsCompressorNode;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.comp = this.ctx.createDynamicsCompressor();
    this.in.connect(this.comp);
    this.comp.connect(this.out);
    this.in.gain.value = 1.0;
    this.out.gain.value = 1.0;
  }

  setAttack(d: number) {
    this.comp.attack.value = d;
  }

  setRelease(d: number) {
    this.comp.release.value = d;
  }

  setThreshold(d: number) {
    this.comp.threshold.value = d;
  }

  setRatio(d: number) {
    this.comp.ratio.value = d;
  }

  setKnee(d: number) {
    this.comp.knee.value = d;
  }

  setParam(p: Partial<CompressorParams>) {
    if (p.attack !== undefined) {
      this.setAttack(p.attack);
    }
    if (p.release !== undefined) {
      this.setRelease(p.release);
    }
    if (p.threshold !== undefined) {
      this.setThreshold(p.threshold);
    }
    if (p.ratio !== undefined) {
      this.setRatio(p.ratio);
    }
    if (p.knee !== undefined) {
      this.setKnee(p.knee);
    }
    if (p.input !== undefined) {
      this.setInput(p.input);
    }
    if (p.output !== undefined) {
      this.setOutput(p.output);
    }
  }

  getParam(): {
    effect: 'Compressor';
    attack: number;
    release: number;
    threshold: number;
    ratio: number;
    knee: number;
    input: number;
    output: number;
  } {
    return {
      effect: 'Compressor',
      attack: this.comp.attack.value,
      release: this.comp.release.value,
      threshold: this.comp.threshold.value,
      ratio: this.comp.ratio.value,
      knee: this.comp.knee.value,
      input: this.in.gain.value,
      output: this.out.gain.value,
    };
  }
}
