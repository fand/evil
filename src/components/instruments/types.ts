// Shared types and constants for instrument editors

export const CELL_SIZE = 26;

// Cell sprite X offsets in sequencer_cell.png
export enum CellType {
  Empty = 0,
  Note = 26,
  Hover = 52,
  Playhead = 78,
  SustainStart = 104,
  SustainMiddle = 130,
  SustainEnd = 156,
}

// Pattern types
export type SynthPattern = (number | 'sustain' | 'end')[];
export type SamplerPattern = [note: number, velocity: number][][];

export type SynthPatternObject = { name: string; pattern: SynthPattern };
export type SamplerPatternObject = { name: string; pattern: SamplerPattern };

// Position types
export interface SynthPos {
  x: number;
  y: number;
  x_abs: number;
  y_abs: number;
  note: number;
}

export interface SamplerPos {
  x: number;
  y: number;
  x_abs: number;
  y_abs: number;
  note: number;
}

// Grid dimensions
export const SYNTH_CELLS_X = 32;
export const SYNTH_CELLS_Y = 20;
export const SAMPLER_CELLS_X = 32;
export const SAMPLER_CELLS_Y = 10;

export const MAX_PAGES = 8;
