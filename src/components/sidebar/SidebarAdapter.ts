import type { Sidebar } from '../../Sidebar';
import type { Player } from '../../Player';
import type { Mixer } from '../../Mixer';
import type { FX } from '../../FX/FX';
import { store } from '../../store';

export type SidebarMode = 'master' | 'tracks';

export interface SidebarState {
  mode: SidebarMode;
  trackIndex: number;
  trackName: string;
}

/**
 * Adapter that bridges the Sidebar model with React Sidebar component.
 */
export class SidebarAdapter {
  private sidebar: Sidebar;
  private player: Player;
  private mixer: Mixer;
  private state: SidebarState = {
    mode: 'master',
    trackIndex: -1,
    trackName: '',
  };
  private listeners: Set<(state: SidebarState) => void> = new Set();

  constructor(sidebar: Sidebar, player: Player, mixer: Mixer) {
    this.sidebar = sidebar;
    this.player = player;
    this.mixer = mixer;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: SidebarState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Get current state
   */
  getState(): SidebarState {
    return this.state;
  }

  /**
   * Show tracks sidebar for a specific instrument
   */
  showTracks(trackIndex: number) {
    const instrument = this.player.instruments[trackIndex];
    if (!instrument) return;

    this.state = {
      mode: 'tracks',
      trackIndex,
      trackName: instrument.name || `Synth #${trackIndex}`,
    };
    this.notifyListeners();

    // Also update the original sidebar model for compatibility
    this.sidebar.show({ x: trackIndex, y: -1, type: 'tracks' });
  }

  /**
   * Show master sidebar
   */
  showMaster(sceneIndex: number = 0) {
    this.state = {
      mode: 'master',
      trackIndex: -1,
      trackName: '',
    };
    this.notifyListeners();

    // Also update the original sidebar model for compatibility
    this.sidebar.show({ x: -1, y: sceneIndex, type: 'master' });
  }

  /**
   * Update track name
   */
  setTrackName(name: string) {
    if (this.state.trackIndex < 0) return;

    const instrument = this.player.instruments[this.state.trackIndex];
    if (instrument) {
      instrument.name = name;
    }

    this.state = { ...this.state, trackName: name };
    this.notifyListeners();
  }

  /**
   * Add effect to master chain
   */
  addMasterEffect(name: string) {
    return this.mixer.addMasterEffect(name);
  }

  /**
   * Add effect to current track
   */
  addTracksEffect(name: string) {
    if (this.state.trackIndex < 0) return null;
    return this.mixer.addTracksEffect(this.state.trackIndex, name);
  }

  /**
   * Get effects for current track
   */
  getTrackEffects(): FX[] {
    if (this.state.trackIndex < 0) return [];
    const instrument = this.player.instruments[this.state.trackIndex];
    return instrument?.effects || [];
  }

  /**
   * Get master effects
   */
  getMasterEffects(): FX[] {
    return this.mixer.effects_master;
  }

  /**
   * Remove effect from master chain
   */
  removeMasterEffect(fx: FX) {
    this.mixer.removeEffect(fx);
    store.getState().triggerEffectsUpdate();
  }

  /**
   * Remove effect from current track
   */
  removeTrackEffect(fx: FX) {
    if (this.state.trackIndex < 0) return;
    const instrument = this.player.instruments[this.state.trackIndex];
    instrument?.removeEffect(fx);
    store.getState().triggerEffectsUpdate();
  }

  /**
   * Save master settings
   */
  saveMaster(settings: {
    name?: string;
    bpm?: number;
    key?: string;
    scale?: string;
  }) {
    if (settings.bpm !== undefined) {
      store.getState().setBPM(settings.bpm);
    }
    if (settings.key !== undefined) {
      store.getState().setKey(settings.key);
    }
    if (settings.scale !== undefined) {
      store.getState().setScale(settings.scale);
    }
    if (settings.name !== undefined) {
      store.getState().setScene({ name: settings.name });
    }
  }
}
