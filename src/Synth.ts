/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { MutekiTimer } from './MutekiTimer';
import { SynthView } from './Synth/View';
import { SynthCore } from './Synth/Core';
import { Panner } from './Panner';
import $ from 'jquery';
import { Fuzz } from './FX/Fuzz';
import { Delay } from './FX/Delay';
import { Reverb } from './FX/Reverb';
import { Compressor } from './FX/Compressor';
import { Double } from './FX/Double';
import { SCALE_LIST } from './Constant';

const T2 = new MutekiTimer();

// Manages SynthCore, SynthView.
class Synth {
  ctx: AudioContext;
  id: number;
  player: any;
  name: string;
  type: string;
  pattern_name: string;
  pattern: any[];
  pattern_obj: { name: string; pattern: any[] };
  time: number;
  scale_name: string;
  scale: number[];
  view: SynthView;
  core: SynthCore;
  is_on: boolean;
  is_sustaining: boolean;
  is_performing: boolean;
  session: any;
  send: GainNode;
  return: GainNode;
  effects: any[];
  T: MutekiTimer;
  duration: number;

  constructor(ctx: AudioContext, id: number, player: any, name: string) {
    this.ctx = ctx;
    this.id = id;
    this.player = player;
    this.name = name;
    this.type = 'REZ';
    if (this.name == null) {
      this.name = 'Synth #' + this.id;
    }
    this.pattern_name = 'pattern 0';
    this.pattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ];
    this.pattern_obj = { name: this.pattern_name, pattern: this.pattern };
    this.time = 0;
    this.scale_name = 'Major';
    this.scale = SCALE_LIST[this.scale_name];
    this.view = new SynthView(this, this.id);
    this.core = new SynthCore(this, this.ctx, this.id);

    this.is_on = false;
    this.is_sustaining = false;
    this.is_performing = false;
    this.session = this.player.session;

    this.send = this.ctx.createGain();
    this.send.gain.value = 1.0;
    this.return = this.ctx.createGain();
    this.return.gain.value = 1.0;
    this.core.connect(this.send);
    this.send.connect(this.return);

    this.effects = [];

    this.T = new MutekiTimer();
  }

  connect(dst) {
    if (dst instanceof Panner) {
      return this.return.connect(dst.in);
    } else {
      return this.return.connect(dst);
    }
  }

  disconnect() {
    return this.return.disconnect();
  }

  setDuration(duration) {
    this.duration = duration;
  }
  setKey(key) {
    return this.core.setKey(key);
  }
  setNote(note) {
    return this.core.setNote(note);
  }

  setScale(scale_name) {
    this.scale_name = scale_name;
    this.scale = SCALE_LIST[this.scale_name];
    this.core.scale = this.scale;
    return this.view.changeScale(this.scale);
  }

  setGain(gain) {
    return this.core.setGain(gain);
  }
  getGain() {
    return this.core.gain;
  }

  noteOn(note, force) {
    if (force || !this.is_performing) {
      this.core.setNote(note);
      this.core.noteOn();
    }
    if (force) {
      return (this.is_performing = true);
    }
  }

  noteOff(force) {
    if (force) {
      this.is_performing = false;
    }
    if (!this.is_performing) {
      return this.core.noteOff();
    }
  }

  playAt(time) {
    this.time = time;
    const mytime = this.time % this.pattern.length;
    this.view.playAt(mytime);
    if (this.is_performing) {
      return;
    }

    // off
    if (this.pattern[mytime] === 0) {
      return this.core.noteOff();

      // sustain start
    } else if (this.pattern[mytime] < 0) {
      this.is_sustaining = true;
      const n = -this.pattern[mytime];
      this.core.setNote(n);
      return this.core.noteOn();

      // sustain mid
    } else if (this.pattern[mytime] === 'sustain') {
      return;

      // sustain end
    } else if (this.pattern[mytime] === 'end') {
      return T2.setTimeout(() => this.core.noteOff(), this.duration - 10);

      // single note
    } else {
      this.core.setNote(this.pattern[mytime]);
      this.core.noteOn();
      return T2.setTimeout(() => this.core.noteOff(), this.duration - 10);
    }
  }

  play() {
    return this.view.play();
  }

  stop() {
    this.core.noteOff();
    return this.view.stop();
  }

  pause(time) {
    return this.core.noteOff();
  }

  setPattern(_pattern_obj) {
    this.pattern_obj = $.extend(true, {}, _pattern_obj);
    this.pattern = this.pattern_obj.pattern;
    this.pattern_name = this.pattern_obj.name;
    return this.view.setPattern(this.pattern_obj);
  }

  getPattern() {
    this.pattern_obj = { name: this.pattern_name, pattern: this.pattern };
    return $.extend(true, {}, this.pattern_obj);
  }

  clearPattern() {
    this.pattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ];
    this.pattern_obj.pattern = this.pattern;
    return this.view.setPattern(this.pattern_obj);
  }

  // Changes the length of @pattern.
  plusPattern() {
    this.pattern = this.pattern.concat([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);
    return this.player.resetSceneLength();
  }

  minusPattern() {
    this.pattern = this.pattern.slice(0, this.pattern.length - 32);
    return this.player.resetSceneLength();
  }

  addNote(time, note) {
    return (this.pattern[time] = note);
  }

  removeNote(time) {
    return (this.pattern[time] = 0);
  }

  sustainNote(l, r, note) {
    if (l === r) {
      this.pattern[l] = note;
      return;
    }
    for (
      let i = l, end = r, asc = l <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.pattern[i] = 'sustain';
    }
    this.pattern[l] = -note;
    return (this.pattern[r] = 'end');
  }

  activate(i) {
    this.view.activate(i);
  }

  deactivate(_i?: number) {
    this.view.deactivate();
  }

  redraw(time: number) {
    this.time = time;
    this.view.drawPattern(this.time);
  }

  // called by SynthView.
  inputPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    this.session.setPatternName(this.id, this.pattern_name);
  }

  setPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    this.view.setPatternName(this.pattern_name);
  }

  setSynthName(name: string) {
    this.name = name;
    this.session.setSynthName(this.id, this.name);
    return this.view.setSynthName(this.name);
  }

  // Get new Synth and replace.
  // called by SynthView.
  changeSynth(type) {
    var s_new = this.player.changeSynth(this.id, type, s_new);
    this.view.dom.replaceWith(s_new.view.dom);
    this.noteOff(true);
    return this.disconnect();
  }

  // Get params as object.
  getParam() {
    const p: any = this.core.getParam();
    p.name = this.name;
    p.scale_name = this.scale_name;
    p.effects = this.getEffectsParam();
    return p;
  }

  setParam(p) {
    if (p == null) {
      return;
    }
    this.core.setParam(p);
    if (p.effects != null) {
      return this.setEffects(p.effects);
    }
  }

  mute() {
    return this.core.mute();
  }
  demute() {
    return this.core.demute();
  }

  // Set effects' params from the song.
  setEffects(effects_new) {
    let e;
    for (e of Array.from(this.effects)) {
      e.disconnect();
    }
    this.effects = [];

    return (() => {
      const result = [];
      for (e of Array.from(effects_new)) {
        var fx;
        if (e.effect === 'Fuzz') {
          fx = new Fuzz(this.ctx);
        } else if (e.effect === 'Delay') {
          fx = new Delay(this.ctx);
        } else if (e.effect === 'Reverb') {
          fx = new Reverb(this.ctx);
        } else if (e.effect === 'Comp') {
          fx = new Compressor(this.ctx);
        } else if (e.effect === 'Double') {
          fx = new Double(this.ctx);
        }

        this.insertEffect(fx);
        result.push(fx.setParam(e));
      }
      return result;
    })();
  }

  getEffectsParam() {
    return Array.from(this.effects).map((f) => f.getParam());
  }

  insertEffect(fx) {
    if (this.effects.length === 0) {
      this.send.disconnect();
      this.send.connect(fx.in);
    } else {
      this.effects[this.effects.length - 1].disconnect();
      this.effects[this.effects.length - 1].connect(fx.in);
    }

    fx.connect(this.return);
    fx.setSource(this);
    return this.effects.push(fx);
  }

  removeEffect(fx) {
    let prev;
    const i = this.effects.indexOf(fx);
    if (i === -1) {
      return;
    }

    if (i === 0) {
      prev = this.send;
    } else {
      prev = this.effects[i - 1];
    }

    prev.disconnect();
    if (this.effects[i + 1] != null) {
      prev.connect(this.effects[i + 1].in);
    } else {
      prev.connect(this.return);
    }

    fx.disconnect();
    return this.effects.splice(i, 1);
  }
}

export { Synth };
