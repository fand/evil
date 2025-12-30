/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { FX } from './FX';
import { FuzzView } from './FuzzView';

type FuzzType = 'Sigmoid' | 'Octavia';

export type FuzzParams = {
  type: FuzzType;
  gain: number;
  input: number;
  output: number;
};

export class Fuzz extends FX {
  fuzz: WaveShaperNode;
  type: string = 'Sigmoid';
  samples: number = 2048;
  gain: number = 0.08;

  override view: FuzzView;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.fuzz = this.ctx.createWaveShaper();
    this.in.connect(this.fuzz);
    this.fuzz.connect(this.out);
    this.in.gain.value = 1.0;
    this.out.gain.value = 1.0;

    this.fuzz.curve = new Float32Array(this.samples);
    this.setGain(0.08);

    this.view = new FuzzView(this);
  }

  setType(type: FuzzType) {
    this.type = type;
  }

  setGain(gain: number) {
    this.gain = gain;

    const sigmax = 2.0 / (1 + Math.exp(-this.gain * 1.0)) - 1.0;
    const ratio = 1.0 / sigmax;

    for (let i = 0; i < this.samples; i++) {
      const x = (i * 2.0) / this.samples - 1.0;
      if (this.type === 'Sigmoid') {
        const sigmoid =
          2.0 / (1 + Math.exp(-Math.pow(this.gain, 3) * 1000 * x)) - 1.0;
        this.fuzz.curve![i] = sigmoid * ratio;
      } else if (this.type === 'Octavia') {
        const sigmoid =
          2.0 / (1 + Math.exp(-Math.pow(this.gain, 2) * 10 * x)) - 1.0;
        this.fuzz.curve![i] = Math.abs(sigmoid * ratio) * 2.0 - 1.0;
      }
    }
  }

  setParam(p: Partial<FuzzParams>) {
    if (p.type != null) {
      this.setType(p.type);
    }
    if (p.gain != null) {
      this.setGain(p.gain);
    }
    if (p.input != null) {
      this.setInput(p.input);
    }
    if (p.output != null) {
      this.setOutput(p.output);
    }
    this.view.setParam(p);
  }

  getParam() {
    return {
      effect: 'Fuzz',
      type: this.type,
      gain: this.gain,
      input: this.in.gain.value,
      output: this.out.gain.value,
    };
  }
}
