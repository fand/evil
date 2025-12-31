import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_SONG, type Song, type Scene } from './Song';

// Playback state
export type PlaybackState = {
  isPlaying: boolean;
  time: number;
  scenePos: number;
  currentCells: (number | undefined)[];
  isLoop: boolean;
  sceneLength: number;
};

// UI state
export type UIState = {
  currentInstrument: number;
};

// Full app state
export type AppState = {
  // Data
  song: Song;
  scene: Scene;

  // Playback
  playback: PlaybackState;

  // UI
  ui: UIState;
};

// Actions
export type AppActions = {
  // Song actions
  setSong: (song: Song) => void;
  updateTrackPattern: (
    trackIdx: number,
    patternIdx: number,
    pattern: Song['tracks'][number]['patterns'][number]
  ) => void;

  // Scene actions
  setScene: (scene: Partial<Scene>) => void;
  setBPM: (bpm: number) => void;
  setKey: (key: string) => void;
  setScale: (scale: string) => void;

  // Playback actions
  setPlaying: (isPlaying: boolean) => void;
  setTime: (time: number) => void;
  setScenePos: (scenePos: number) => void;
  setCurrentCells: (cells: (number | undefined)[]) => void;
  setCurrentCell: (trackIdx: number, cellIdx: number | undefined) => void;
  toggleLoop: () => boolean;
  setSceneLength: (length: number) => void;

  // UI actions
  setCurrentInstrument: (idx: number) => void;

  // Utility
  reset: () => void;
};

export type Store = AppState & AppActions;

const initialPlayback: PlaybackState = {
  isPlaying: false,
  time: 0,
  scenePos: 0,
  currentCells: [],
  isLoop: true,
  sceneLength: 32,
};

const initialUI: UIState = {
  currentInstrument: 0,
};

const initialScene: Scene = {
  name: '',
  bpm: 120,
  key: 'A',
  scale: 'Major',
};

export const store = createStore<Store>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    song: DEFAULT_SONG,
    scene: initialScene,
    playback: initialPlayback,
    ui: initialUI,

    // Song actions
    setSong: (song) => set({ song }),

    updateTrackPattern: (trackIdx, patternIdx, pattern) =>
      set((state) => {
        const tracks = [...state.song.tracks];
        if (tracks[trackIdx]) {
          const patterns = [...tracks[trackIdx].patterns];
          patterns[patternIdx] = pattern;
          tracks[trackIdx] = { ...tracks[trackIdx], patterns };
        }
        return { song: { ...state.song, tracks } };
      }),

    // Scene actions
    setScene: (scene) =>
      set((state) => ({
        scene: { ...state.scene, ...scene },
      })),

    setBPM: (bpm) =>
      set((state) => ({
        scene: { ...state.scene, bpm },
      })),

    setKey: (key) =>
      set((state) => ({
        scene: { ...state.scene, key },
      })),

    setScale: (scale) =>
      set((state) => ({
        scene: { ...state.scene, scale },
      })),

    // Playback actions
    setPlaying: (isPlaying) =>
      set((state) => ({
        playback: { ...state.playback, isPlaying },
      })),

    setTime: (time) =>
      set((state) => ({
        playback: { ...state.playback, time },
      })),

    setScenePos: (scenePos) =>
      set((state) => ({
        playback: { ...state.playback, scenePos },
      })),

    setCurrentCells: (currentCells) =>
      set((state) => ({
        playback: { ...state.playback, currentCells },
      })),

    setCurrentCell: (trackIdx, cellIdx) =>
      set((state) => {
        const currentCells = [...state.playback.currentCells];
        currentCells[trackIdx] = cellIdx;
        return { playback: { ...state.playback, currentCells } };
      }),

    toggleLoop: () => {
      const newLoop = !get().playback.isLoop;
      set((state) => ({
        playback: { ...state.playback, isLoop: newLoop },
      }));
      return newLoop;
    },

    setSceneLength: (sceneLength) =>
      set((state) => ({
        playback: { ...state.playback, sceneLength },
      })),

    // UI actions
    setCurrentInstrument: (currentInstrument) =>
      set((state) => ({
        ui: { ...state.ui, currentInstrument },
      })),

    // Utility
    reset: () =>
      set({
        song: DEFAULT_SONG,
        scene: initialScene,
        playback: initialPlayback,
        ui: initialUI,
      }),
  }))
);

// Selector helpers for subscribeWithSelector
export const selectSong = (state: Store) => state.song;
export const selectScene = (state: Store) => state.scene;
export const selectPlayback = (state: Store) => state.playback;
export const selectUI = (state: Store) => state.ui;
export const selectBPM = (state: Store) => state.scene.bpm;
export const selectKey = (state: Store) => state.scene.key;
export const selectScale = (state: Store) => state.scene.scale;
export const selectIsPlaying = (state: Store) => state.playback.isPlaying;
export const selectTime = (state: Store) => state.playback.time;
export const selectCurrentCells = (state: Store) => state.playback.currentCells;
export const selectScenePos = (state: Store) => state.playback.scenePos;
export const selectCurrentInstrument = (state: Store) => state.ui.currentInstrument;
