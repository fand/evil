import type { InstrumentType } from './Instrument';

export type SynthPattern = (number | 'sustain' | 'end')[];
export type SamplerNote = [note: number, velocity: number];
export type SamplerPattern = SamplerNote[][];
export type Pattern = SynthPattern | SamplerPattern;

// Effect parameter types
export type FuzzEffectParam = {
  effect: 'Fuzz';
  type: string;
  gain: number;
  input: number;
  output: number;
};

export type DoubleEffectParam = {
  effect: 'Double';
  delay: number;
  width: number;
};

export type ReverbEffectParam = {
  effect: 'Reverb';
  name: string;
  wet: number;
};

export type CompressorEffectParam = {
  effect: 'Compressor';
  attack: number;
  release: number;
  threshold: number;
  ratio: number;
  knee: number;
  input: number;
  output: number;
};

export type DelayEffectParam = {
  effect: 'Delay';
  delay: number;
  feedback: number;
  lofi: number;
  wet: number;
};

export type EffectParam =
  | FuzzEffectParam
  | DoubleEffectParam
  | ReverbEffectParam
  | CompressorEffectParam
  | DelayEffectParam;

// VCO parameter type
export type VCOParam = {
  shape: string;
  octave: number;
  interval: number;
  fine: number;
};

// Envelope generator parameter type
export type EGParam = {
  adsr: [attack: number, decay: number, sustain: number, release: number];
  range: [min: number, max: number];
};

// Synth parameter type
export type SynthParam = {
  type: 'REZ';
  vcos: VCOParam[];
  gains: number[];
  eg: EGParam;
  feg: EGParam;
  filter: [cutoff: number, q: number];
  harmony: boolean;
  scale_name?: string;
};

// Sample node parameter type
export type SampleNodeParam = {
  wave: string;
  time: [start: number, end: number, loop: number];
  gains: [lo: number, mid: number, hi: number];
  output: [volume: number, pan: number];
};

// Sampler parameter type
export type SamplerParam = {
  type: 'SAMPLER';
  samples: SampleNodeParam[];
};

// Track instrument parameter type
export type TrackParam = SynthParam | SamplerParam;

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

export type SynthPatternObject = {
  name: string;
  pattern: SynthPattern;
};

export type SamplerPatternObject = {
  name: string;
  pattern: SamplerPattern;
};

export type Track = {
  id: number;
  type: InstrumentType;
  name: string;
  patterns: (PatternObject | undefined)[];
  params?: TrackParam;
  gain: number;
  pan: number;
  effects?: EffectParam[];
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
