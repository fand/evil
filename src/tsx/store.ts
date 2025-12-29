import { create } from 'zustand';
import Player from '../ts/Player';

interface AppStore {
  player: Player | null;
  setPlayer: (player: Player) => void;
}

/**
 * Global application state store using Zustand.
 * Currently holds the Player instance which contains all models (Mixer, Session, etc.)
 */
export const useAppStore = create<AppStore>((set) => ({
  player: null,
  setPlayer: (player: Player) => set({ player }),
}));
