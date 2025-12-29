/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { SynthCoreView } from './CoreView';
import { MutekiTimer } from '../MutekiTimer';
import { KEY_LIST, NoteKey, SEMITONE, STREAM_LENGTH } from '../Constant';

//#
// CONSTANTS

const OSC_TYPE = {
  SINE: 'sine',
  RECT: 'square',
  SAW: 'sawtooth',
  TRIANGLE: 'triangle',
};

// Offsets for supersaw / superrect
const TIME_OFFSET = [2, 3, 5, 7, 11, 13, 17];
const FREQ_OFFSET = [0.1, 0.15, 0.25, 0.35, 0.55, 0.65, 0.85];

// Timer only for this module
const T2 = new MutekiTimer();

// Noise Oscillator.
class Noise {
  ctx: AudioContext;
  node: ScriptProcessorNode;
  octae: number;
  fine: number;
  interval: number;
  shape: string;
  octave: number;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.node = this.ctx.createScriptProcessor(STREAM_LENGTH);
    this.node.onaudioprocess = (event) => {
      const data_L = event.outputBuffer.getChannelData(0);
      const data_R = event.outputBuffer.getChannelData(1);
      return __range__(0, data_L.length, false).map(
        (i) => (data_L[i] = data_R[i] = Math.random())
      );
    };
  }

  connect(dst) {
    return this.node.connect(dst);
  }
  setOctave(octae) {
    this.octae = octae;
  }
  setFine(fine) {
    this.fine = fine;
  }
  setNote() {}
  setInterval(interval) {
    this.interval = interval;
  }
  setFreq() {}
  setKey() {}
  setShape(shape) {
    this.shape = shape;
  }

  getParam() {
    return {
      shape: this.shape,
      octave: this.octave,
      interval: this.interval,
      fine: this.fine,
    };
  }

  setParam(p) {
    this.shape = p.shape;
    this.octave = p.octave;
    this.interval = p.interval;
    return (this.fine = p.fine);
  }
}

// Oscillators.
class VCO {
  ctx: AudioContext;
  freq_key: number;
  octave: number;
  interval: number;
  fine: number;
  note: number;
  freq: number;
  node: GainNode;
  osc: OscillatorNode;
  oscs: OscillatorNode[];
  shape: string;
  dst: AudioNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.freq_key = 55;
    this.octave = 4;
    this.interval = 0;
    this.fine = 0;
    this.note = 0;
    this.freq = Math.pow(2, this.octave) * this.freq_key;

    this.node = this.ctx.createGain();
    this.node.gain.value = 1.0;
    this.osc = this.ctx.createOscillator();
    this.osc.type = 'sine';

    this.oscs = [
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
      this.ctx.createOscillator(),
    ];

    this.setFreq();
    this.osc.start(0);
    for (let i = 0; i < 7; i++) {
      this.oscs[i].start(TIME_OFFSET[i]);
    }
  }

  setOctave(octave) {
    this.octave = octave;
  }
  setNote(note) {
    this.note = note;
  }
  setKey(freq_key) {
    this.freq_key = freq_key;
  }
  setInterval(interval) {
    this.interval = interval;
  }

  setFine(fine) {
    this.fine = fine;
    this.osc.detune.value = this.fine;
    return Array.from(this.oscs).map((o) => (o.detune.value = this.fine));
  }

  setShape(shape) {
    let o;
    this.shape = shape;
    if (this.shape === 'SUPERSAW') {
      for (o of Array.from(this.oscs)) {
        o.type = OSC_TYPE['SAW'];
        o.connect(this.node);
      }
      this.osc.disconnect();
      return (this.node.gain.value = 0.9);
    } else if (this.shape === 'SUPERRECT') {
      for (o of Array.from(this.oscs)) {
        o.type = OSC_TYPE['RECT'];
        o.connect(this.node);
      }
      this.osc.disconnect();
      return (this.node.gain.value = 0.9);
    } else {
      for (o of Array.from(this.oscs)) {
        o.disconnect();
      }
      this.osc.type = OSC_TYPE[this.shape];
      this.osc.connect(this.node);
      return (this.node.gain.value = 1.0);
    }
  }

  setFreq() {
    const note_oct = Math.floor(this.note / 12);
    const note_shift = this.note % 12;
    this.freq =
      Math.pow(2, this.octave + note_oct) *
        Math.pow(SEMITONE, note_shift) *
        this.freq_key +
      this.fine;

    if (this.shape === 'SUPERSAW' || this.shape === 'SUPERRECT') {
      return [0, 1, 2, 3, 4, 5, 6].map((i) =>
        this.oscs[i].frequency.setValueAtTime(this.freq + FREQ_OFFSET[i], 0)
      );
    } else {
      return this.osc.frequency.setValueAtTime(this.freq, 0);
    }
  }

  connect(dst) {
    this.dst = dst;
    this.osc.connect(this.node);
    for (var o of Array.from(this.oscs)) {
      o.connect(this.node);
    }
    return this.node.connect(this.dst);
  }

  disconnect() {
    return this.node.disconnect();
  }

  getParam() {
    return {
      shape: this.shape,
      octave: this.octave,
      interval: this.interval,
      fine: this.fine,
    };
  }

  setParam(p) {
    this.octave = p.octave;
    this.interval = p.interval;
    this.fine = p.fine;
    return this.setShape(p.shape);
  }
}

// Envelope generator.
class EG {
  target: AudioParam;
  min: number;
  max: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;

  constructor(target: AudioParam, min: number, max: number) {
    this.target = target;
    this.min = min;
    this.max = max;
    this.attack = 0;
    this.decay = 0;
    this.sustain = 0.0;
    this.release = 0;
  }

  getADSR() {
    return [this.attack, this.decay, this.sustain, this.release];
  }
  setADSR(attack, decay, sustain, release) {
    this.attack = attack / 50000.0;
    this.decay = decay / 50000.0;
    this.sustain = sustain / 100.0;
    return (this.release = release / 50000.0);
  }

  getRange() {
    return [this.min, this.max];
  }
  setRange(min, max) {
    this.min = min;
    this.max = max;
  }

  getParam() {
    return { adsr: this.getADSR(), range: this.getRange() };
  }
  setParam(p) {
    [this.attack, this.decay, this.sustain, this.release] = Array.from(p.adsr);
    return this.setRange(p.range[0], p.range[1]);
  }

  noteOn(time) {
    this.target.cancelScheduledValues(time);

    this.target.setValueAtTime(this.target.value, time);

    this.target.linearRampToValueAtTime(this.max, time + this.attack);
    return this.target.linearRampToValueAtTime(
      this.sustain * (this.max - this.min) + this.min,
      time + this.attack + this.decay
    );
  }

  noteOff(time) {
    this.target.linearRampToValueAtTime(this.min, time + this.release);
    this.target.linearRampToValueAtTime(0, time + this.release + 0.001);
    return this.target.cancelScheduledValues(time + this.release + 0.002);
  }
}

// Manages filter params.
class ResFilter {
  ctx: AudioContext;
  lpf: BiquadFilterNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.lpf = this.ctx.createBiquadFilter();
    this.lpf.type = 'lowpass'; // lowpass == 0
    this.lpf.gain.value = 1.0;
  }

  connect(dst) {
    return this.lpf.connect(dst);
  }
  disconnect() {
    return this.lpf.disconnect();
  }
  getResonance() {
    return this.lpf.Q.value;
  }
  setQ(Q) {
    return (this.lpf.Q.value = Q);
  }
  getQ() {
    return this.lpf.Q.value;
  }
}

// Manages VCO, Noise, ResFilter, EG.
class SynthCore {
  parent: any;
  ctx: AudioContext;
  id: any;
  node: GainNode;
  gain: number;
  is_mute: boolean;
  is_on: boolean;
  is_harmony: boolean;
  scale: number[];
  vcos: (VCO | Noise)[];
  gains: GainNode[];
  filter: ResFilter;
  eg: EG;
  feg: EG;
  gain_res: GainNode;
  view: SynthCoreView;
  note: number;

  constructor(parent: any, ctx: AudioContext, id: any) {
    this.parent = parent;
    this.ctx = ctx;
    this.id = id;
    this.node = this.ctx.createGain();
    this.node.gain.value = 0;
    this.gain = 1.0;
    this.is_mute = false;
    this.is_on = false;
    this.is_harmony = true;

    this.scale = this.parent.scale;
    this.vcos = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
    this.gains = [
      this.ctx.createGain(),
      this.ctx.createGain(),
      this.ctx.createGain(),
    ];
    for (let i = 0; i < 3; i++) {
      this.vcos[i].connect(this.gains[i]);
      this.gains[i].gain.value = 0;
      this.gains[i].connect(this.node);
    }

    this.filter = new ResFilter(this.ctx);

    this.eg = new EG(this.node.gain, 0.0, this.gain);
    this.feg = new EG(this.filter.lpf.frequency, 0, 0);

    // Noise generator for resonance.
    this.gain_res = this.ctx.createGain();
    this.gain_res.gain.value = 0;
    this.vcos[2].connect(this.gain_res);
    this.gain_res.connect(this.node);

    this.view = new SynthCoreView(
      this,
      this.id,
      this.parent.view.dom.find('.synth-core')
    );
  }

  getParam() {
    return {
      type: 'REZ',
      vcos: Array.from(this.vcos).map((v) => v.getParam()),
      gains: Array.from(this.gains).map((g) => g.gain.value),
      eg: this.eg.getParam(),
      feg: this.feg.getParam(),
      filter: [this.feg.getRange()[1], this.filter.getQ()],
      harmony: this.is_harmony,
    };
  }

  setParam(p) {
    let i;
    if (p.vcos != null) {
      let asc, end;
      for (
        i = 0, end = p.vcos.length, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        this.vcos[i].setParam(p.vcos[i]);
      }
    }
    if (p.gains != null) {
      let asc1, end1;
      for (
        i = 0, end1 = p.gains.length, asc1 = 0 <= end1;
        asc1 ? i < end1 : i > end1;
        asc1 ? i++ : i--
      ) {
        this.gains[i].gain.value = p.gains[i];
      }
    }
    if (p.eg != null) {
      this.eg.setParam(p.eg);
    }
    if (p.feg != null) {
      this.feg.setParam(p.feg);
    }
    if (p.filter != null) {
      this.feg.setRange(this.feg.getRange()[0], p.filter[0]);
      this.filter.setQ(p.filter[1]);
    }
    return this.view.setParam(p);
  }

  setVCOParam(i, shape, oct, interval, fine, harmony) {
    this.vcos[i].setShape(shape);
    this.vcos[i].setOctave(oct);
    this.vcos[i].setInterval(interval);
    this.vcos[i].setFine(fine);
    this.vcos[i].setFreq();
    if (harmony != null) {
      return (this.is_harmony = harmony === 'harmony');
    }
  }

  setEGParam(a, d, s, r) {
    return this.eg.setADSR(a, d, s, r);
  }
  setFEGParam(a, d, s, r) {
    return this.feg.setADSR(a, d, s, r);
  }

  setFilterParam(freq, q) {
    this.feg.setRange(80, Math.pow(freq / 1000, 2.0) * 25000 + 80);
    this.filter.setQ(q);
    if (q > 1) {
      return (this.gain_res.gain.value = 0.1 * (q / 1000.0));
    }
  }

  setVCOGain(i, gain) {
    //# Keep total gain <= 0.9
    return (this.gains[i].gain.value = (gain / 100.0) * 0.3);
  }

  setGain(gain) {
    this.gain = gain;
    return this.eg.setRange(0.0, this.gain);
  }

  noteOn() {
    if (this.is_mute) {
      return;
    }
    if (this.is_on) {
      return;
    }
    const t0 = this.ctx.currentTime;
    this.eg.noteOn(t0);
    this.feg.noteOn(t0);
    return (this.is_on = true);
  }

  noteOff() {
    if (!this.is_on) {
      return;
    }
    const t0 = this.ctx.currentTime;
    this.eg.noteOff(t0);
    this.feg.noteOff(t0);
    return (this.is_on = false);
  }

  setKey(key: NoteKey) {
    const freq_key = KEY_LIST[key];
    return Array.from(this.vcos).map((v) => v.setKey(freq_key));
  }

  setScale(scale: number[]) {
    this.scale = scale;
  }

  connect(dst) {
    this.node.connect(this.filter.lpf);
    return this.filter.connect(dst);
  }

  disconnect() {
    this.filter.disconnect();
    return this.node.disconnect();
  }

  // Converts interval (n-th note) to semitones.
  noteToSemitone(note, shift) {
    let semitone;
    if (this.is_harmony) {
      note = note + shift;
      if (shift > 0) {
        note--;
      }
      if (shift < 0) {
        note++;
      }
      return (semitone =
        Math.floor((note - 1) / this.scale.length) * 12 +
        this.scale[(note - 1) % this.scale.length]);
    } else {
      return (semitone =
        Math.floor((note - 1) / this.scale.length) * 12 +
        this.scale[(note - 1) % this.scale.length] +
        shift);
    }
  }

  setNote(note) {
    this.note = note;
    return (() => {
      const result = [];
      for (var v of Array.from(this.vcos)) {
        v.setNote(this.noteToSemitone(this.note, v.interval));
        result.push(v.setFreq());
      }
      return result;
    })();
  }

  mute() {
    return (this.is_mute = true);
  }
  demute() {
    return (this.is_mute = false);
  }
}

export { SynthCore };

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
