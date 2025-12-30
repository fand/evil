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
import { SCALE_LIST, NoteKey } from './Constant';
import type { Player } from './Player';
import type { FX } from './FX/FX';

const T2 = new MutekiTimer();

// Manages SynthCore, SynthView.
class Synth {
  ctx: AudioContext;
  id: number;
  player: Player;
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
  effects: FX[];
  T: MutekiTimer;
  duration: number = 0;

  constructor(ctx: AudioContext, id: number, player: Player, name?: string) {
    this.ctx = ctx;
    this.id = id;
    this.player = player;

    this.name = name ?? `Synth #${id}`;
    this.type = 'REZ';

    this.pattern_name = 'pattern 0';
    this.pattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ];
    this.pattern_obj = { name: this.pattern_name, pattern: this.pattern };
    this.time = 0;
    this.scale_name = 'Major';
    this.scale = SCALE_LIST[this.scale_name as keyof typeof SCALE_LIST];
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

  connect(dst: AudioNode) {
    if (dst instanceof Panner) {
      return this.return.connect(dst.in);
    } else {
      return this.return.connect(dst);
    }
  }

  disconnect() {
    this.return.disconnect();
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setKey(key: NoteKey) {
    return this.core.setKey(key);
  }

  setNote(note: number) {
    return this.core.setNote(note);
  }

  setScale(scale_name: string) {
    this.scale_name = scale_name;
    this.scale = SCALE_LIST[this.scale_name as keyof typeof SCALE_LIST];
    this.core.scale = this.scale;
    return this.view.changeScale(this.scale);
  }

  setGain(gain: number) {
    this.core.setGain(gain);
  }

  getGain(): number {
    return this.core.gain;
  }

  noteOn(note: number, force: boolean) {
    if (force || !this.is_performing) {
      this.core.setNote(note);
      this.core.noteOn();
    }
    if (force) {
      return (this.is_performing = true);
    }
  }

  noteOff(force: boolean) {
    if (force) {
      this.is_performing = false;
    }
    if (!this.is_performing) {
      return this.core.noteOff();
    }
  }

  playAt(time: number) {
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
    this.view.play();
  }

  stop() {
    this.core.noteOff();
    this.view.stop();
  }

  pause() {
    this.core.noteOff();
  }

  setPattern(pattern_obj: { name: string; pattern: any[] }) {
    this.pattern_obj = JSON.parse(JSON.stringify(pattern_obj));
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

  addNote(time: number, note: number) {
    this.pattern[time] = note;
  }

  removeNote(time: number) {
    return (this.pattern[time] = 0);
  }

  sustainNote(l: number, r: number, note: number) {
    if (l === r) {
      this.pattern[l] = note;
      return;
    }
    for (let i = l; i < r; i++) {
      this.pattern[i] = 'sustain';
    }
    this.pattern[l] = -note;
    this.pattern[r] = 'end';
  }

  activate() {
    this.view.activate();
  }

  deactivate() {
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
  changeSynth(type: string) {
    if (type !== 'REZ' && type !== 'SAMPLER') {
      throw new TypeError(`Invalid instrument type: ${type}`);
    }

    const s_new = this.player.changeSynth(this.id, type);
    this.view.dom.replaceWith(s_new.view.dom);
    this.noteOff(true);
    this.disconnect();
  }

  // Get params as object.
  getParam() {
    const p: any = this.core.getParam();
    p.name = this.name;
    p.scale_name = this.scale_name;
    p.effects = this.getEffectsParam();
    return p;
  }

  setParam(p: any) {
    if (p == null) {
      return;
    }
    this.core.setParam(p);
    if (p.effects != null) {
      this.setEffects(p.effects);
    }
  }

  mute() {
    this.core.mute();
  }

  unmute() {
    this.core.unmute();
  }

  // Set effects' params from the song.
  setEffects(effects_new: { effect: string }[]) {
    for (const e of this.effects) {
      e.disconnect();
    }
    this.effects = [];

    for (const e of Array.from(effects_new)) {
      let fx: FX;
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
      } else {
        throw new Error(`Invalid FX type: ${e.effect}`);
      }

      this.insertEffect(fx);
      fx.setParam(e);
    }
  }

  getEffectsParam() {
    return Array.from(this.effects).map((f) => f.getParam());
  }

  insertEffect(fx: FX) {
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

  removeEffect(fx: FX) {
    const i = this.effects.indexOf(fx);
    if (i === -1) {
      return;
    }

    let prev: GainNode | FX;
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
