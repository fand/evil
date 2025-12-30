import { SAMPLE_RATE } from '../Constant';
import { Panner } from '../Panner';
import { SAMPLES as SAMPLE } from './Constant';
import type { SamplerCore } from './SamplerCore';

export class SampleNode {
  ctx: AudioContext;
  id: number;
  parent: SamplerCore;
  out: GainNode;
  name: string;
  head: number;
  tail: number;
  speed: number;
  merger: ChannelMergerNode;
  node_buf: GainNode;
  eq_gains: [lo: number, mid: number, hi: number];
  eq_nodes: BiquadFilterNode[];
  panner: Panner;
  pan_value: number;
  sample: { url: string; data?: AudioBuffer } | undefined;
  buffer: AudioBuffer | undefined;
  buffer_duration: number | undefined;
  dst: AudioNode | undefined;
  source_old: AudioBufferSourceNode | undefined;

  constructor(ctx: AudioContext, id: number, parent: SamplerCore) {
    this.ctx = ctx;
    this.id = id;
    this.parent = parent;
    this.out = this.ctx.createGain();
    this.out.gain.value = 1.0;
    this.name = SAMPLE.DEFAULT[this.id];
    this.setSample(this.name);

    this.head = 0.0;
    this.tail = 1.0;
    this.speed = 1.0;

    // for mono source
    this.merger = this.ctx.createChannelMerger(2);

    // node to set gain for individual nodes
    this.node_buf = this.ctx.createGain();
    this.node_buf.gain.value = 1.0;

    this.eq_gains = [0.0, 0.0, 0.0];

    const eq1 = this.ctx.createBiquadFilter();
    const eq2 = this.ctx.createBiquadFilter();
    const eq3 = this.ctx.createBiquadFilter();
    eq1.type = 'lowshelf';
    eq2.type = 'peaking';
    eq3.type = 'highshelf';
    eq1.Q.value = eq2.Q.value = eq3.Q.value = 0.6;
    eq1.frequency.value = 350;
    eq2.frequency.value = 2000;
    eq3.frequency.value = 4000;
    eq1.gain.value = this.eq_gains[0];
    eq2.gain.value = this.eq_gains[1];
    eq3.gain.value = this.eq_gains[2];
    this.eq_nodes = [eq1, eq2, eq3];

    this.panner = new Panner(this.ctx);
    this.pan_value = 0.5;

    this.node_buf.connect(eq1);
    eq1.connect(eq2);
    eq2.connect(eq3);
    eq3.connect(this.panner.in);
    this.panner.connect(this.out);
  }

  setSample(name: string) {
    this.name = name;

    const sample = SAMPLE.DATA[this.name as keyof typeof SAMPLE.DATA] as { url: string; data?: AudioBuffer };
    if (!sample) {
      return;
    }

    this.sample = sample;
    if (sample.data) {
      this.buffer = sample.data;
    } else {
      const req = new XMLHttpRequest();
      req.open('GET', import.meta.env.BASE_URL + sample.url, true);
      req.responseType = 'arraybuffer';
      req.onload = () => {
        this.ctx.decodeAudioData(
          req.response,
          (buffer) => {
            this.buffer = buffer;
            this.buffer_duration = this.buffer.length / SAMPLE_RATE;
            this.parent.sampleLoaded(this.id);
          },
          (err) => {
            console.log('Failed to fetch ' + sample.url);
            console.log(err);
          }
        );
        (sample as any).data = this.buffer;
      };
      req.send();
    }
  }

  connect(dst: AudioNode) {
    this.dst = dst;
    this.out.connect(this.dst);
  }

  noteOn(gain: number, time: number) {
    if (!this.buffer || !this.buffer_duration) {
      return;
    }
    if (this.source_old) {
      this.source_old.stop(time);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;

    // source.connect(@node_buf)            # for mono source
    source.connect(this.merger, 0, 0); // for stereo source
    source.connect(this.merger, 0, 1);
    this.merger.connect(this.node_buf);

    const head_time = time + this.buffer_duration * this.head;
    const tail_time = time + this.buffer_duration * this.tail;
    source.playbackRate.value = this.speed;
    source.start(0);
    this.node_buf.gain.value = gain;
    this.source_old = source;
  }

  setTimeParam(head: number, tail: number, speed: number) {
    this.head = head;
    this.tail = tail;
    this.speed = speed;
  }

  getTimeParam(): [head: number, tail: number, speed: number] {
    return [this.head, this.tail, this.speed];
  }

  setEQParam(eq_gains: [lo: number, mid: number, hi: number]) {
    this.eq_gains = eq_gains;
    this.eq_nodes[0].gain.value = this.eq_gains[0] * 0.2;
    this.eq_nodes[1].gain.value = this.eq_gains[1] * 0.2;
    this.eq_nodes[2].gain.value = this.eq_gains[2] * 0.2;
  }

  getEQParam() {
    return this.eq_gains;
  }

  setOutputParam(pan_value: number, gain: number) {
    this.pan_value = pan_value;
    this.panner.setPosition(this.pan_value);
    this.out.gain.value = gain;
  }

  getOutputParam(): [pan: number, gain: number] {
    return [this.pan_value, this.out.gain.value];
  }

  getData() {
    return this.buffer;
  }

  getParam() {
    return {
      wave: this.name,
      time: this.getTimeParam(),
      gains: this.eq_gains,
      output: this.getOutputParam(),
    };
  }

  setParam(p: any) {
    if (p.wave !== undefined) {
      this.setSample(p.wave);
    }
    if (p.time !== undefined) {
      this.setTimeParam(p.time[0], p.time[1], p.time[2]);
    }
    if (p.gains !== undefined) {
      this.setEQParam(p.gains);
    }
    if (p.output !== undefined) {
      this.setOutputParam(p.output[0], p.output[1]);
    }
  }
}
