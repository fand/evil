import { FX } from './FX';

export type DelayParams = {
  delay: number;
  feedback: number;
  lofi: number;
  wet: number;
};

export class Delay extends FX {
  delay: DelayNode;
  lofi: BiquadFilterNode;
  feedback: GainNode;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.value = 0.23;

    this.lofi = this.ctx.createBiquadFilter();
    this.lofi.type = 'peaking';
    this.lofi.frequency.value = 1200;
    this.lofi.Q.value = 0.0; // range is [0.0, 5.0]
    this.lofi.gain.value = 1.0;

    this.feedback = this.ctx.createGain();
    this.feedback.gain.value = 0.2;

    this.in.connect(this.lofi);
    this.lofi.connect(this.delay);
    this.delay.connect(this.wet);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.lofi);

    this.wet.connect(this.out);
    this.in.connect(this.out);
  }

  setDelay(d: number) {
    this.delay.delayTime.value = d;
  }

  setFeedback(d: number) {
    this.feedback.gain.value = d;
  }

  setLofi(d: number) {
    this.lofi.Q.value = d;
  }

  setParam(p: Partial<DelayParams>) {
    if (p.delay !== undefined) {
      this.setDelay(p.delay);
    }
    if (p.feedback !== undefined) {
      this.setFeedback(p.feedback);
    }
    if (p.lofi !== undefined) {
      this.setLofi(p.lofi);
    }
    if (p.wet !== undefined) {
      this.setWet(p.wet);
    }
  }

  getParam(): { effect: 'Delay' } & DelayParams {
    return {
      effect: 'Delay',
      delay: this.delay.delayTime.value,
      feedback: this.feedback.gain.value,
      lofi: this.lofi.Q.value,
      wet: this.wet.gain.value,
    };
  }
}
