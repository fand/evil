import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_SONG, type Song, type Scene } from './Song';

// Beat info for cue visualization
export type BeatInfo = {
  trigger: number; // Incremented on each beat to trigger re-render
  isMaster: boolean;
  cells: [number, number | undefined] | [number, number][];
};

// Playback state
export type PlaybackState = {
  isPlaying: boolean;
  time: number;
  scenePos: number;
  currentCells: (number | undefined)[];
  isLoop: boolean;
  sceneLength: number;
  beat: BeatInfo;
};

// View mode
export type ViewMode = 'SYNTH' | 'MIXER';

// UI state
export type UIState = {
  currentInstrument: number;
  viewMode: ViewMode;
  // Pattern version per instrument - incremented when pattern changes
  patternVersions: Record<number, number>;
  // Dialog state
  dialog: {
    isOpen: boolean;
    type: 'success' | 'error' | null;
    url: string;
    songTitle: string;
    userName: string;
  };
};

// Mixer state
export type MixerState = {
  trackGains: number[];
  masterGain: number;
  trackPans: number[];
  masterPan: number;
};

// Effects state
export type EffectsState = {
  masterEffects: string[]; // Array of effect IDs
  trackEffects: Record<number, string[]>; // trackIndex -> array of effect IDs
  version: number; // Increment to trigger re-render
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

  // Mixer
  mixer: MixerState;

  // Effects
  effects: EffectsState;
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
  triggerBeat: (
    isMaster: boolean,
    cells: [number, number | undefined] | [number, number][]
  ) => void;

  // UI actions
  setCurrentInstrument: (idx: number) => void;
  setViewMode: (mode: ViewMode) => void;
  triggerPatternRefresh: (instrumentId: number) => void;
  showSuccessDialog: (url: string, songTitle: string, userName: string) => void;
  showErrorDialog: () => void;
  closeDialog: () => void;

  // Mixer actions
  setTrackGain: (trackIdx: number, gain: number) => void;
  setMasterGain: (gain: number) => void;
  setTrackPan: (trackIdx: number, pan: number) => void;
  setMasterPan: (pan: number) => void;
  addMixerTrack: () => void;
  resetMixer: () => void;
  loadMixerState: (state: MixerState) => void;

  // Effects actions
  addMasterEffect: (id: string) => void;
  removeMasterEffect: (id: string) => void;
  addTrackEffect: (trackIdx: number, id: string) => void;
  removeTrackEffect: (trackIdx: number, id: string) => void;
  triggerEffectsUpdate: () => void;

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
  beat: {
    trigger: 0,
    isMaster: false,
    cells: [],
  },
};

const initialUI: UIState = {
  currentInstrument: 0,
  viewMode: 'SYNTH',
  patternVersions: {},
  dialog: {
    isOpen: false,
    type: null,
    url: '',
    songTitle: '',
    userName: '',
  },
};

const initialMixer: MixerState = {
  trackGains: [],
  masterGain: 1.0,
  trackPans: [],
  masterPan: 0.5,
};

const initialEffects: EffectsState = {
  masterEffects: [],
  trackEffects: {},
  version: 0,
};

const initialScene: Scene = {
  name: '',
  bpm: 120,
  key: 'A',
  scale: 'Major',
};

export const store = createStore<Store>()(
  subscribeWithSelector((set, get) => ({
    // Initial state (clone DEFAULT_SONG to avoid mutation)
    song: { ...DEFAULT_SONG, tracks: [], master: [...DEFAULT_SONG.master] },
    scene: initialScene,
    playback: initialPlayback,
    ui: initialUI,
    mixer: initialMixer,
    effects: initialEffects,

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

    triggerBeat: (isMaster, cells) =>
      set((state) => ({
        playback: {
          ...state.playback,
          beat: {
            trigger: state.playback.beat.trigger + 1,
            isMaster,
            cells,
          },
        },
      })),

    // UI actions
    setCurrentInstrument: (currentInstrument) =>
      set((state) => ({
        ui: { ...state.ui, currentInstrument },
      })),

    setViewMode: (viewMode) =>
      set((state) => ({
        ui: { ...state.ui, viewMode },
      })),

    triggerPatternRefresh: (instrumentId) =>
      set((state) => ({
        ui: {
          ...state.ui,
          patternVersions: {
            ...state.ui.patternVersions,
            [instrumentId]: (state.ui.patternVersions[instrumentId] || 0) + 1,
          },
        },
      })),

    showSuccessDialog: (url, songTitle, userName) =>
      set((state) => ({
        ui: {
          ...state.ui,
          dialog: {
            isOpen: true,
            type: 'success',
            url,
            songTitle,
            userName,
          },
        },
      })),

    showErrorDialog: () =>
      set((state) => ({
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            isOpen: true,
            type: 'error',
          },
        },
      })),

    closeDialog: () =>
      set((state) => ({
        ui: {
          ...state.ui,
          dialog: {
            ...state.ui.dialog,
            isOpen: false,
          },
        },
      })),

    // Mixer actions
    setTrackGain: (trackIdx, gain) =>
      set((state) => {
        const trackGains = [...state.mixer.trackGains];
        trackGains[trackIdx] = gain;
        return { mixer: { ...state.mixer, trackGains } };
      }),

    setMasterGain: (gain) =>
      set((state) => ({
        mixer: { ...state.mixer, masterGain: gain },
      })),

    setTrackPan: (trackIdx, pan) =>
      set((state) => {
        const trackPans = [...state.mixer.trackPans];
        trackPans[trackIdx] = pan;
        return { mixer: { ...state.mixer, trackPans } };
      }),

    setMasterPan: (pan) =>
      set((state) => ({
        mixer: { ...state.mixer, masterPan: pan },
      })),

    addMixerTrack: () =>
      set((state) => ({
        mixer: {
          ...state.mixer,
          trackGains: [...state.mixer.trackGains, 1.0],
          trackPans: [...state.mixer.trackPans, 0.5],
        },
      })),

    resetMixer: () => set({ mixer: initialMixer }),

    loadMixerState: (mixerState) => set({ mixer: mixerState }),

    // Effects actions
    addMasterEffect: (id) =>
      set((state) => ({
        effects: {
          ...state.effects,
          masterEffects: [...state.effects.masterEffects, id],
          version: state.effects.version + 1,
        },
      })),

    removeMasterEffect: (id) =>
      set((state) => ({
        effects: {
          ...state.effects,
          masterEffects: state.effects.masterEffects.filter((i) => i !== id),
          version: state.effects.version + 1,
        },
      })),

    addTrackEffect: (trackIdx, id) =>
      set((state) => ({
        effects: {
          ...state.effects,
          trackEffects: {
            ...state.effects.trackEffects,
            [trackIdx]: [...(state.effects.trackEffects[trackIdx] || []), id],
          },
          version: state.effects.version + 1,
        },
      })),

    removeTrackEffect: (trackIdx, id) =>
      set((state) => ({
        effects: {
          ...state.effects,
          trackEffects: {
            ...state.effects.trackEffects,
            [trackIdx]: (state.effects.trackEffects[trackIdx] || []).filter(
              (i) => i !== id
            ),
          },
          version: state.effects.version + 1,
        },
      })),

    triggerEffectsUpdate: () =>
      set((state) => ({
        effects: {
          ...state.effects,
          version: state.effects.version + 1,
        },
      })),

    // Utility
    reset: () =>
      set({
        song: { ...DEFAULT_SONG, tracks: [], master: [...DEFAULT_SONG.master] },
        scene: initialScene,
        playback: initialPlayback,
        ui: initialUI,
        mixer: initialMixer,
        effects: initialEffects,
      }),
  }))
);

// Selector helpers for subscribeWithSelector
export const selectKey = (state: Store) => state.scene.key;
export const selectScale = (state: Store) => state.scene.scale;
