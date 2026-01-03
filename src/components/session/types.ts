import type { Song } from '../../Song';

// Cell position
export interface CellPos {
  x: number;
  y: number;
  type?: 'tracks' | 'master';
}

// Canvas dimensions
export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 20;
export const MASTER_WIDTH = 80;
export const OFFSET_Y = 20;
export const FONT_SIZE = 12;

// Color type
export type ColorScheme = readonly string[];

// Color schemes
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  REZ: [
    'rgba(200, 200, 200, 1.0)',
    'rgba(  0, 220, 250, 0.7)',
    'rgba(100, 230, 255, 0.7)',
    'rgba(200, 200, 200, 1.0)',
    'rgba(255, 255, 255, 1.0)',
    'rgba(100, 230, 255, 0.2)',
  ],
  SAMPLER: [
    'rgba(230, 230, 230, 1.0)',
    'rgba(255, 100, 192, 0.7)',
    'rgba(255, 160, 216, 0.7)',
    'rgba(200, 200, 200, 1.0)',
    'rgba(255, 255, 255, 1.0)',
    'rgba(255, 160, 216, 0.2)',
  ],
};

export const DEFAULT_COLOR: ColorScheme = COLOR_SCHEMES.REZ;

// Pattern type from Song
export type Pattern = Song['tracks'][number]['patterns'][number];
export type MasterPattern = Song['master'][number];
