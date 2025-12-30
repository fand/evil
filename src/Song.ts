import type { InstrumentType } from './Instrument';

export const DEFAULT_SONG: Song = {
  tracks: [],
  length: 1,
  master: [
    {
      name: 'section-0',
      bpm: 144,
      key: 'A',
      scale: 'minor',
    },
  ],
};

export type Song = {
  tracks: Track[];
  length: number;
  master: Master[];
  mixer?: MixerParam | null;
};

export type Track = {
  type?: InstrumentType;
  name: string;
  [key: string]: unknown;
};

export type Master = {
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
