/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import Panner from "../Panner";
import SAMPLE from "./Constant";
import CONSTANT from "../Constant";

class SampleNode {
  ctx: AudioContext;
  id: number;
  parent: any;
  out: GainNode;
  name: string;
  head: number;
  tail: number;
  speed: number;
  merger: ChannelMergerNode;
  node_buf: GainNode;
  eq_gains: number[];
  eq_nodes: BiquadFilterNode[];
  panner: Panner;
  pan_value: number;
  sample: any;
  buffer: AudioBuffer;
  buffer_duration: number;
  dst: AudioNode;
  source_old: AudioBufferSourceNode;

  constructor(ctx: AudioContext, id: number, parent: any) {
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

    const [eq1, eq2, eq3] = Array.from([
      this.ctx.createBiquadFilter(),
      this.ctx.createBiquadFilter(),
      this.ctx.createBiquadFilter(),
    ]);
    [eq1.type, eq2.type, eq3.type] = Array.from([
      "lowshelf",
      "peaking",
      "highshelf",
    ]);
    [eq1.Q.value, eq2.Q.value, eq3.Q.value] = Array.from([0.6, 0.6, 0.6]);
    [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] =
      Array.from([350, 2000, 4000]);
    [eq1.gain.value, eq2.gain.value, eq3.gain.value] = Array.from(
      this.eq_gains,
    );
    this.eq_nodes = [eq1, eq2, eq3];

    this.panner = new Panner(this.ctx);
    this.pan_value = 0.5;

    this.node_buf.connect(eq1);
    eq1.connect(eq2);
    eq2.connect(eq3);
    eq3.connect(this.panner.in);
    this.panner.connect(this.out);
  }

  setSample(name) {
    this.name = name;
    const sample = SAMPLE.DATA[this.name];
    if (sample == null) {
      return;
    }
    this.sample = sample;
    if (sample.data != null) {
      return (this.buffer = sample.data);
    } else {
      const req = new XMLHttpRequest();
      req.open("GET", sample.url, true);
      req.responseType = "arraybuffer";
      req.onload = () => {
        this.ctx.decodeAudioData(
          req.response,
          (buffer) => {
            this.buffer = buffer;
            this.buffer_duration = this.buffer.length / CONSTANT.SAMPLE_RATE;
            return this.parent.sampleLoaded(this.id);
          },
          (err) => {
            console.log("Failed to fetch " + sample.url);
            return console.log(err);
          },
        );
        return (sample.data = this.buffer);
      };
      return req.send();
    }
  }

  connect(dst) {
    this.dst = dst;
    return this.out.connect(this.dst);
  }

  noteOn(gain, time) {
    if (this.buffer == null) {
      return;
    }
    if (this.source_old != null) {
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
    return (this.source_old = source);
  }

  setTimeParam(head, tail, speed) {
    this.head = head;
    this.tail = tail;
    this.speed = speed;
  }
  getTimeParam() {
    return [this.head, this.tail, this.speed];
  }

  setEQParam(eq_gains) {
    let ref;
    this.eq_gains = eq_gains;
    return (
      ([
        this.eq_nodes[0].gain.value,
        this.eq_nodes[1].gain.value,
        this.eq_nodes[2].gain.value,
      ] = Array.from((ref = Array.from(this.eq_gains).map((g) => g * 0.2)))),
      ref
    );
  }

  getEQParam() {
    return this.eq_gains;
  }

  setOutputParam(pan_value, gain) {
    this.pan_value = pan_value;
    this.panner.setPosition(this.pan_value);
    return (this.out.gain.value = gain);
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

  setParam(p) {
    if (p.wave != null) {
      this.setSample(p.wave);
    }
    if (p.time != null) {
      this.setTimeParam(p.time[0], p.time[1], p.time[2]);
    }
    if (p.gains != null) {
      this.setEQParam(p.gains);
    }
    if (p.output != null) {
      return this.setOutputParam(p.output[0], p.output[1]);
    }
  }
}

// Export!
export default SampleNode;
