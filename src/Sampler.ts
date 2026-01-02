import { Panner } from './Panner';
import { SamplerCore } from './Sampler/SamplerCore';
import $ from 'jquery';
import type { Player } from './Player';
import type { Session } from './Session';
import type { Instrument, InstrumentType } from './Instrument';
import type { FX } from './FX/FX';
import type {
  SamplerPattern,
  SamplerPatternObject,
  SamplerParam,
  EffectParam,
} from './Song';
import { store } from './store';

class Sampler implements Instrument {
  ctx: AudioContext;
  id: number;
  player: Player;
  name: string;
  type: InstrumentType;
  pattern_obj: SamplerPatternObject;

  get pattern_name(): string {
    return this.pattern_obj.name;
  }

  set pattern_name(value: string) {
    this.pattern_obj.name = value;
  }

  get pattern(): SamplerPattern {
    return this.pattern_obj.pattern;
  }

  set pattern(value: SamplerPattern) {
    this.pattern_obj.pattern = value;
  }
  time: number;
  core: SamplerCore;
  is_sustaining: boolean;
  session: Session;
  send: GainNode;
  return: GainNode;
  effects: FX[];

  constructor(ctx: AudioContext, id: number, player: Player, name?: string) {
    this.ctx = ctx;
    this.id = id;
    this.player = player;

    this.name = name ?? `Sampler #${id}`;
    this.type = 'SAMPLER';

    this.pattern_obj = {
      name: 'pattern 0',
      pattern: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    };

    this.time = 0;
    this.core = new SamplerCore(this, this.ctx, this.id);

    this.is_sustaining = false;
    this.session = this.player.session;

    this.send = this.ctx.createGain();
    this.send.gain.value = 1.0;
    this.return = this.ctx.createGain();
    this.return.gain.value = 1.0;
    this.core.connect(this.send);
    this.send.connect(this.return);

    this.effects = [];
  }

  connect(dst: AudioNode | Panner) {
    if (dst instanceof Panner) {
      this.return.connect(dst.in);
    } else {
      this.return.connect(dst);
    }
  }

  disconnect() {
    this.return.disconnect();
  }

  setDuration() {}
  setKey() {}
  setScale() {}
  setNote() {
    // SamplerCore does not support setNote
  }

  setGain(gain: number) {
    this.core.setGain(gain);
  }

  getGain() {
    return this.core.gain;
  }

  noteOn(note: number) {
    this.core.noteOn([[note, 1.0]]);
  }

  noteOff() {
    this.core.noteOff();
  }

  playAt(time: number) {
    this.time = time;
    const mytime = this.time % this.pattern.length;
    // React SamplerEditor handles playback position via store
    if (this.pattern[mytime].length > 0) {
      const notes = this.pattern[mytime];
      this.core.noteOn(notes);
    }
  }

  play() {
    // React SamplerEditor handles playback state via store
  }

  stop() {
    this.core.noteOff();
    // React SamplerEditor handles playback state via store
  }

  pause() {
    this.core.noteOff();
  }

  setPattern(_pattern_obj: SamplerPatternObject) {
    this.pattern_obj = $.extend(true, {}, _pattern_obj);
    store.getState().triggerPatternRefresh(this.id);
  }

  getPattern(): SamplerPatternObject {
    return $.extend(true, {}, this.pattern_obj);
  }

  clearPattern() {
    this.pattern = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    store.getState().triggerPatternRefresh(this.id);
  }

  plusPattern() {
    this.pattern = this.pattern.concat([
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);
    this.player.resetSceneLength();
  }

  minusPattern() {
    this.pattern = this.pattern.slice(0, this.pattern.length - 32);
    this.player.resetSceneLength();
  }

  addNote(time: number, note: number, gain: number) {
    if (!Array.isArray(this.pattern[time])) {
      this.pattern[time] = [[this.pattern[time], 1.0]];
    }

    for (let i = 0; i < this.pattern[time].length; i++) {
      if (this.pattern[time][i][0] === note) {
        this.pattern[time].splice(i, 1);
      }
    }

    this.pattern[time].push([note, gain]);
  }

  removeNote(pos: { x_abs: number; note: number }) {
    for (let i = 0; i < this.pattern[pos.x_abs].length; i++) {
      if (this.pattern[pos.x_abs][i][0] === pos.note) {
        this.pattern[pos.x_abs].splice(i, 1);
      }
    }
  }

  activate() {
    // React SamplerEditor handles activation via store.ui.currentInstrument
  }

  deactivate() {
    // React SamplerEditor handles activation via store.ui.currentInstrument
  }

  redraw(time: number) {
    this.time = time;
    // React SamplerEditor redraws via playback.time subscription
  }

  setInstrumentName(name: string) {
    this.name = name;
    this.session.setTrackName(this.id, this.name);
    // React SamplerEditor reads name from model
  }

  // called by SamplerView.
  inputPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    this.session.setPatternName(this.id, this.pattern_name);
  }

  setPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    // React SamplerEditor reads pattern_name from model
  }

  selectSample(sample_now: number) {
    this.core.bindSample(sample_now);
  }

  changeInstrument(type: string) {
    if (type !== 'REZ' && type !== 'SAMPLER') {
      throw new TypeError(`Invalid instrument type: ${type}`);
    }

    this.player.changeInstrument(this.id, type);
    // React InstrumentsContainer re-renders based on player.synths changes
    this.noteOff();
    this.disconnect();
  }

  getParam(): SamplerParam & { name: string; effects: EffectParam[] } {
    const p = this.core.getParam();
    return {
      ...p,
      name: this.name,
      effects: this.getEffectsParam(),
    };
  }

  setParam(p: Partial<SamplerParam>) {
    if (p) {
      this.core.setParam(p);
    }
  }

  mute() {
    this.core.mute();
  }

  unmute() {
    this.core.unmute();
  }

  getEffectsParam(): EffectParam[] {
    return this.effects.map((f) => f.getParam());
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
    this.effects.push(fx);
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
    if (this.effects[i + 1]) {
      prev.connect(this.effects[i + 1].in);
    } else {
      prev.connect(this.return);
    }

    fx.disconnect();
    this.effects.splice(i, 1);
  }
}

export { Sampler };
