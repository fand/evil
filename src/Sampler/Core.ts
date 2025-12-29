/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { SampleNode as SamplerNode } from './Node';
import { SamplerCoreView } from './CoreView';
import { SAMPLES } from './Constant';

class SamplerCore {
  parent: any;
  ctx: AudioContext;
  id: any;
  node: GainNode;
  gain: number;
  is_mute: boolean;
  samples: SamplerNode[];
  view: SamplerCoreView;

  constructor(parent: any, ctx: AudioContext, id: any) {
    let i;
    this.parent = parent;
    this.ctx = ctx;
    this.id = id;
    this.node = this.ctx.createGain();
    this.node.gain.value = 1.0;
    this.gain = 1.0;
    this.is_mute = false;

    this.samples = (() => {
      const result = [];
      for (i = 0; i < 10; i++) {
        result.push(new SamplerNode(this.ctx, i, this));
      }
      return result;
    })();

    for (i = 0; i < 10; i++) {
      this.samples[i].connect(this.node);
    }

    this.view = new SamplerCoreView(
      this,
      this.id,
      this.parent.view.dom.find('.sampler-core')
    );
  }

  noteOn(notes) {
    if (this.is_mute) {
      return;
    }
    const time = this.ctx.currentTime;
    if (Array.isArray(notes)) {
      // return if notes.length == 0
      return Array.from(notes).map((n) =>
        this.samples[n[0] - 1].noteOn(n[1], time)
      );
    }
  }
  // else
  //     @samples[notes - 1].noteOn(1, time)

  noteOff() {
    let t0;
    return (t0 = this.ctx.currentTime);
  }

  connect(dst) {
    return this.node.connect(dst);
  }

  setSample(i, name) {
    return this.samples[i].setSample(name);
  }

  setSampleTimeParam(i, head, tail, speed) {
    return this.samples[i].setTimeParam(head, tail, speed);
  }

  setSampleEQParam(i, lo, mid, hi) {
    return this.samples[i].setEQParam([lo, mid, hi]);
  }

  setSampleOutputParam(i, pan, gain) {
    return this.samples[i].setOutputParam(pan, gain);
  }

  setGain(gain) {
    this.gain = gain;
    return (this.node.gain.value = this.gain);
  }

  getSampleTimeParam(i) {
    return this.samples[i].getTimeParam();
  }

  getSampleData(i) {
    return this.samples[i].getData();
  }

  getSampleEQParam(i) {
    return this.samples[i].getEQParam();
  }

  getSampleOutputParam(i) {
    return this.samples[i].getOutputParam();
  }

  sampleLoaded(id) {
    return this.view.updateWaveformCanvas(id);
  }

  bindSample(sample_now) {
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

  setParam(p) {
    if (p.samples != null) {
      for (
        let i = 0, end = p.samples.length, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        this.samples[i].setParam(p.samples[i]);
      }
    }
    return this.bindSample(0);
  }

  mute() {
    return (this.is_mute = true);
  }
  demute() {
    return (this.is_mute = false);
  }
}

export { SamplerCore };
