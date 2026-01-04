import type { EffectParam } from '../Song';
import type { Instrument } from '../Instrument';
import type { Mixer } from '../Mixer';

export abstract class FX {
  protected ctx: AudioContext;
  in: GainNode;
  protected dry: GainNode;
  wet: GainNode;
  out: GainNode;
  protected source: Instrument | Mixer | undefined;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.in = this.ctx.createGain();
    this.in.gain.value = 1.0;
    this.dry = this.ctx.createGain();
    this.dry.gain.value = 1.0;
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 1.0;
    this.out = this.ctx.createGain();
    this.out.gain.value = 1.0;
  }

  connect(dst: AudioNode) {
    this.out.connect(dst);
  }
  disconnect() {
    this.out.disconnect();
  }

  setInput(d: number) {
    this.in.gain.value = d;
  }

  setOutput(d: number) {
    this.out.gain.value = d;
  }

  setDry(d: number) {
    this.dry.gain.value = d;
  }

  setWet(d: number) {
    this.wet.gain.value = d;
  }

  remove() {
    if (this.source && 'removeEffect' in this.source) {
      (this.source as Instrument).removeEffect(this);
    }
  }

  setSource(source: Instrument | Mixer) {
    this.source = source;
  }

  abstract setParam(p: unknown): void;

  abstract getParam(): EffectParam;
}
