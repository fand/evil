import { SampleNode as SamplerNode } from './SampleNode';
import type { Sampler } from '../Sampler';
import type { SamplerParam } from '../Song';

export class SamplerCore {
  parent: Sampler;
  ctx: AudioContext;
  id: number;
  node: GainNode;
  gain: number;
  is_mute: boolean;
  samples: SamplerNode[];

  constructor(parent: Sampler, ctx: AudioContext, id: number) {
    this.parent = parent;
    this.ctx = ctx;
    this.id = id;
    this.node = this.ctx.createGain();
    this.node.gain.value = 1.0;
    this.gain = 1.0;
    this.is_mute = false;

    this.samples = [];

    for (let i = 0; i < 10; i++) {
      const sample = new SamplerNode(this.ctx, i, this);
      sample.connect(this.node);
      this.samples.push(sample);
    }
    // React SamplerEditor handles the sampler-core UI
  }

  noteOn(notes: [number, number][] | number) {
    if (this.is_mute) {
      return;
    }

    const time = this.ctx.currentTime;
    if (Array.isArray(notes)) {
      if (notes.length == 0) {
        return;
      }
      notes.forEach((n) => this.samples[n[0] - 1].noteOn(n[1], time));
    } else {
      this.samples[notes - 1].noteOn(1, time);
    }
  }

  noteOff() {
    // TODO: ???
  }

  connect(dst: AudioNode) {
    this.node.connect(dst);
  }

  setSample(i: number, name: string) {
    this.samples[i].setSample(name);
  }

  setSampleTimeParam(i: number, head: number, tail: number, speed: number) {
    this.samples[i].setTimeParam(head, tail, speed);
  }

  setSampleEQParam(i: number, lo: number, mid: number, hi: number) {
    this.samples[i].setEQParam([lo, mid, hi]);
  }

  setSampleOutputParam(i: number, pan: number, gain: number) {
    this.samples[i].setOutputParam(pan, gain);
  }

  setGain(gain: number) {
    this.gain = gain;
    this.node.gain.value = this.gain;
  }

  setSampleGain(i: number, gain: number) {
    this.samples[i].setOutputParam(this.samples[i].pan_value, gain);
  }

  getSampleTimeParam(i: number) {
    return this.samples[i].getTimeParam();
  }

  getSampleData(i: number) {
    return this.samples[i].getData();
  }

  getSampleEQParam(i: number) {
    return this.samples[i].getEQParam();
  }

  getSampleOutputParam(i: number) {
    return this.samples[i].getOutputParam();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sampleLoaded(_id?: number) {
    // React SamplerEditor handles waveform display via getParam()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bindSample(_sample_now?: number) {
    // React SamplerEditor handles sample binding via state
  }

  getParam(): SamplerParam {
    return {
      type: 'SAMPLER',
      samples: this.samples.map((s) => s.getParam()),
    };
  }

  setParam(p: Partial<SamplerParam>) {
    if (p.samples) {
      for (let i = 0; i < p.samples.length; i++) {
        this.samples[i].setParam(p.samples[i]);
      }
    }
    this.bindSample(0);
  }

  mute() {
    this.is_mute = true;
  }

  unmute() {
    this.is_mute = false;
  }
}
