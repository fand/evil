import type { Panner } from './Panner';
import type { FX } from './FX/FX';

export interface InstrumentView {
  dom: JQuery;
}

export interface Instrument {
  id: number;
  name: string;
  type: InstrumentType;
  pattern: any[];
  pattern_name: string;
  view: InstrumentView;

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
  setParam(p: any): void;
  getParam(): any;
  deactivate(): void;
  activate(): void;
  connect(dst: AudioNode | Panner): void;
  disconnect(): void;
  setGain(gain: number): void;
  getGain(): number;
  setPattern(pattern_obj: { name: string; pattern: any[] }): void;
  getPattern(): { name: string; pattern: any[] };
  clearPattern(): void;
  setPatternName(pattern_name: string): void;
  insertEffect(fx: FX): void;
  getEffectsParam(): any[];
}

export type InstrumentType = 'REZ' | 'SAMPLER';
