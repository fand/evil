/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { SampleNode as SamplerNode } from './SampleNode';
import { SamplerCoreView } from './CoreView';
import type { Sampler } from '../Sampler';

export class SamplerCore {
  parent: Sampler;
  ctx: AudioContext;
  id: number;
  node: GainNode;
  gain: number;
  is_mute: boolean;
  samples: SamplerNode[];
  view: SamplerCoreView;

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

    this.view = new SamplerCoreView(
      this,
      this.id,
      this.parent.view.dom.find('.sampler-core')
    );
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
      return Array.from(notes).map((n) =>
        this.samples[n[0] - 1].noteOn(n[1], time)
      );
    } else {
      this.samples[notes - 1].noteOn(1, time);
    }
  }

  noteOff() {
    let t0;
    return (t0 = this.ctx.currentTime); // TODO: ???
  }

  connect(dst: AudioNode) {
    return this.node.connect(dst);
  }

  setSample(i: number, name: string) {
    return this.samples[i].setSample(name);
  }

  setSampleTimeParam(i: number, head: number, tail: number, speed: number) {
    return this.samples[i].setTimeParam(head, tail, speed);
  }

  setSampleEQParam(i: number, lo: number, mid: number, hi: number) {
    return this.samples[i].setEQParam([lo, mid, hi]);
  }

  setSampleOutputParam(i: number, pan: number, gain: number) {
    return this.samples[i].setOutputParam(pan, gain);
  }

  setGain(gain: number) {
    this.gain = gain;
    this.node.gain.value = this.gain;
  }

  setSampleGain(i: number, gain: number) {
    return this.samples[i].setParam({ gain });
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

  sampleLoaded(id: number) {
    return this.view.updateWaveformCanvas(id);
  }

  bindSample(sample_now: number) {
    this.view.bindSample(sample_now, this.samples[sample_now].getParam());
    this.view.setSampleTimeParam(this.getSampleTimeParam(sample_now));
    this.view.setSampleEQParam(this.getSampleEQParam(sample_now));
    return this.view.setSampleOutputParam(
      this.getSampleOutputParam(sample_now)
    );
  }

  getParam() {
    return {
      type: 'SAMPLER',
      samples: Array.from(this.samples).map((s) => s.getParam()),
    };
  }

  setParam(p: any) {
    if (p.samples != null) {
      for (let i = 0; i < p.samples.length; i++) {
        this.samples[i].setParam(p.samples[i]);
      }
    }
    return this.bindSample(0);
  }

  mute() {
    this.is_mute = true;
  }

  unmute() {
    this.is_mute = false;
  }
}
