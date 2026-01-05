import type { Panner } from './Panner';
import type { FX } from './FX/FX';
import type { Pattern, PatternObject, TrackParam, EffectParam } from './Song';

export interface Instrument {
  id: number;
  name: string;
  type: InstrumentType;
  pattern: Pattern;
  pattern_name: string;
  effects: FX[];

  setDuration(duration: number): void;
  setKey(key: string): void;
  setScale(scale: string): void;
  play(): void;
  stop(): void;
  pause(time?: number): void;
  redraw(time: number): void;
  noteOn(note: number, force?: boolean): void;
  noteOff(force?: boolean): void;
  playAt(time: number): void;
  unmute(): void;
  mute(): void;
  setParam(p: Partial<TrackParam>): void;
  getParam(): TrackParam;
  deactivate(): void;
  activate(): void;
  connect(dst: AudioNode | Panner): void;
  disconnect(): void;
  setGain(gain: number): void;
  getGain(): number;
  setPattern(pattern_obj: PatternObject): void;
  getPattern(): PatternObject;
  clearPattern(): void;
  setPatternName(pattern_name: string): void;
  plusPattern(): void;
  minusPattern(): void;
  insertEffect(fx: FX): void;
  removeEffect(fx: FX): void;
  getEffectsParam(): EffectParam[];
}

export type InstrumentType = 'REZ' | 'SAMPLER';
