import type { InstrumentType } from './Instrument';

export type SynthPattern = (number | 'sustain' | 'end')[];
export type SamplerNote = [note: number, velocity: number];
export type SamplerPattern = SamplerNote[][];
export type Pattern = SynthPattern | SamplerPattern;

export const DEFAULT_SCENE = {
  name: 'section-0',
  bpm: 144,
  key: 'A',
  scale: 'minor',
};

export const DEFAULT_SONG: Song = {
  tracks: [],
  length: 1,
  master: [DEFAULT_SCENE],
};

export type Song = {
  tracks: Track[];
  length: number;
  master: Scene[];
  mixer?: MixerParam | null;
  title?: string;
  creator?: string;
};

export type PatternObject = {
  name: string;
  pattern: Pattern;
};

export type Track = {
  id: number;
  type: InstrumentType;
  name: string;
  patterns: (PatternObject | undefined)[];
  params: unknown[];
  gain: number;
  pan: number;
  effects?: unknown[];
};

export type Scene = {
  name: string;
  bpm: number;
  key: string;
  scale: string;
};

export type MixerParam = {
  gain_tracks: number[];
  gain_master: number;
  pan_tracks: number[];
  pan_master: number;
};
