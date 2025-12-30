/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { FX } from './FX';
import { CompressorView } from './CompressorView';

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
  view: CompressorView;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.comp = this.ctx.createDynamicsCompressor();
    this.in.connect(this.comp);
    this.comp.connect(this.out);
    this.in.gain.value = 1.0;
    this.out.gain.value = 1.0;

    this.view = new CompressorView(this);
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
    if (p.attack != null) {
      this.setAttack(p.attack);
    }
    if (p.release != null) {
      this.setRelease(p.release);
    }
    if (p.threshold != null) {
      this.setThreshold(p.threshold);
    }
    if (p.ratio != null) {
      this.setRatio(p.ratio);
    }
    if (p.knee != null) {
      this.setKnee(p.knee);
    }
    if (p.input != null) {
      this.setInput(p.input);
    }
    if (p.output != null) {
      this.setOutput(p.output);
    }
    return this.view.setParam(p);
  }

  getParam() {
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
