import { MutekiTimer } from './MutekiTimer';
import { SynthCore } from './Synth/SynthCore';
import { Panner } from './Panner';
import $ from 'jquery';
import { Fuzz } from './FX/Fuzz';
import { Delay } from './FX/Delay';
import { Reverb } from './FX/Reverb';
import { Compressor } from './FX/Compressor';
import { Double } from './FX/Double';
import { SCALE_LIST, NoteKey, isNoteKey } from './Constant';
import type { Player } from './Player';
import type { FX } from './FX/FX';
import type { Instrument, InstrumentType } from './Instrument';
import type { Session } from './Session';
import type {
  SynthPattern,
  SynthPatternObject,
  SynthParam,
  EffectParam,
} from './Song';
import { store, selectKey, selectScale } from './store';

const T2 = new MutekiTimer();

// Manages SynthCore. React SynthEditor handles the view.
class Synth implements Instrument {
  ctx: AudioContext;
  id: number;
  player: Player;
  name: string;
  type: InstrumentType;
  pattern_obj: SynthPatternObject;
  time: number;
  scale_name: string;
  scale: number[];
  core: SynthCore;
  is_on: boolean;
  is_sustaining: boolean;
  is_performing: boolean;
  session: Session;
  send: GainNode;
  return: GainNode;
  effects: FX[];
  duration: number = 0;

  // pattern_obj is the single source of truth
  get pattern(): SynthPattern {
    return this.pattern_obj.pattern;
  }

  set pattern(value: SynthPattern) {
    this.pattern_obj.pattern = value;
  }

  get pattern_name(): string {
    return this.pattern_obj.name;
  }

  set pattern_name(value: string) {
    this.pattern_obj.name = value;
  }

  constructor(ctx: AudioContext, id: number, player: Player, name?: string) {
    this.ctx = ctx;
    this.id = id;
    this.player = player;

    this.name = name ?? `Synth #${id}`;
    this.type = 'REZ';

    // Initialize pattern_obj first (single source of truth)
    this.pattern_obj = {
      name: 'pattern 0',
      pattern: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
    };
    this.time = 0;
    this.scale_name = 'Major';
    this.scale = SCALE_LIST[this.scale_name as keyof typeof SCALE_LIST];
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

    this.subscribeStore();
  }

  subscribeStore() {
    // Subscribe to Key changes from store
    store.subscribe(selectKey, (key) => {
      if (isNoteKey(key)) {
        this.core.setKey(key);
      }
    });

    // Subscribe to Scale changes from store
    // React SynthEditor subscribes to scene.scale for keyboard display
    store.subscribe(selectScale, (scale) => {
      if (scale in SCALE_LIST) {
        this.scale_name = scale;
        this.scale = SCALE_LIST[scale as keyof typeof SCALE_LIST];
      }
    });
  }

  connect(dst: AudioNode) {
    if (dst instanceof Panner) {
      this.return.connect(dst.in);
    } else {
      this.return.connect(dst);
    }
  }

  disconnect() {
    this.return.disconnect();
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setKey(key: NoteKey) {
    this.core.setKey(key);
  }

  setNote(note: number) {
    this.core.setNote(note);
  }

  setScale(scale_name: string) {
    this.scale_name = scale_name;
    this.scale = SCALE_LIST[this.scale_name as keyof typeof SCALE_LIST];
    // React SynthEditor subscribes to scene.scale for keyboard display
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
      this.is_performing = true;
    }
  }

  noteOff(force: boolean) {
    if (force) {
      this.is_performing = false;
    }
    if (!this.is_performing) {
      this.core.noteOff();
    }
  }

  playAt(time: number) {
    this.time = time;
    const mytime = this.time % this.pattern.length;
    // React SynthEditor subscribes to playback.time for position bar
    if (this.is_performing) {
      return;
    }

    const note = this.pattern[mytime];

    // off
    if (note === 0) {
      this.core.noteOff();

      // sustain start
    } else if (typeof note === 'number' && note < 0) {
      this.is_sustaining = true;
      this.core.setNote(-note);
      this.core.noteOn();

      // sustain mid
    } else if (note === 'sustain') {
      // do nothing
      // sustain end
    } else if (note === 'end') {
      T2.setTimeout(() => this.core.noteOff(), this.duration - 10);

      // single note
    } else if (typeof note === 'number') {
      this.core.setNote(note);
      this.core.noteOn();
      T2.setTimeout(() => this.core.noteOff(), this.duration - 10);
    }
  }

  play() {
    // React SynthEditor handles playback state via store
  }

  stop() {
    this.core.noteOff();
    // React SynthEditor handles playback state via store
  }

  pause() {
    this.core.noteOff();
  }

  setPattern(pattern_obj: SynthPatternObject) {
    this.pattern_obj = JSON.parse(JSON.stringify(pattern_obj));
    store.getState().triggerPatternRefresh(this.id);
  }

  getPattern(): SynthPatternObject {
    return $.extend(true, {}, this.pattern_obj);
  }

  clearPattern() {
    this.pattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ];
    store.getState().triggerPatternRefresh(this.id);
  }

  // Changes the length of @pattern.
  plusPattern() {
    this.pattern = this.pattern.concat([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);
    this.player.resetSceneLength();
  }

  minusPattern() {
    this.pattern = this.pattern.slice(0, this.pattern.length - 32);
    this.player.resetSceneLength();
  }

  addNote(time: number, note: number) {
    this.pattern[time] = note;
  }

  removeNote(time: number) {
    this.pattern[time] = 0;
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
    // React SynthEditor handles activation via store.ui.currentInstrument
  }

  deactivate() {
    // React SynthEditor handles activation via store.ui.currentInstrument
  }

  redraw(time: number) {
    this.time = time;
    // React SynthEditor redraws via playback.time subscription
  }

  // called by SynthView.
  inputPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    this.session.setPatternName(this.id, this.pattern_name);
  }

  setPatternName(pattern_name: string) {
    this.pattern_name = pattern_name;
    // React SynthEditor reads pattern_name from model
  }

  setSynthName(name: string) {
    this.name = name;
    this.session.setTrackName(this.id, this.name);
    // React SynthEditor reads name from model
  }

  // Get new Synth and replace.
  // called by controller.changeInstrumentType
  changeSynth(type: string) {
    if (type !== 'REZ' && type !== 'SAMPLER') {
      throw new TypeError(`Invalid instrument type: ${type}`);
    }

    this.player.changeInstrument(this.id, type);
    // React InstrumentsContainer re-renders based on player.synths changes
    this.noteOff(true);
    this.disconnect();
  }

  // Get params as object.
  getParam(): SynthParam & { name: string; effects: EffectParam[] } {
    const p = this.core.getParam();
    return {
      ...p,
      name: this.name,
      scale_name: this.scale_name,
      effects: this.getEffectsParam(),
    };
  }

  setParam(p: Partial<SynthParam & { effects: EffectParam[] }>) {
    if (!p) {
      return;
    }
    this.core.setParam(p);
    if (p.effects) {
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

    for (const e of effects_new) {
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

export { Synth };
