/**
 * SessionViewAdapter - Minimal adapter to replace SessionView for React.
 * Handles non-rendering methods (dialogs, state) while React handles rendering.
 */
import { store } from '../../store';
import type { Session } from '../../Session';
import type { Song } from '../../Song';

export class SessionViewAdapter {
  private _session: Session;
  private select_pos: { x: number; y: number; type: string } = { x: 0, y: 0, type: 'master' };

  get song(): Song {
    return this._session.song;
  }

  constructor(model: Session) {
    this._session = model;
  }

  // ========================================
  // No-op methods - React handles rendering via store
  // ========================================

  loadSong(_currentCells: (number | undefined)[]) {
    // React components subscribe to store.song for updates
    this._session.syncSongToStore();
  }

  drawScene(_pos: number, _cells: (number | undefined)[]) {
    // React subscribes to playback.scenePos and playback.currentCells
  }

  drawTrackName(idx: number, name: string, _type?: string) {
    // Sync to store so React can pick it up
    if (this.song.tracks[idx]) {
      this.song.tracks[idx].name = name;
      this._session.syncSongToStore();
    }
  }

  drawPatternName(_x: number, _y: number, _p: { name: string }) {
    // React re-renders from store.song
    this._session.syncSongToStore();
  }

  clearAllActive() {
    // React subscribes to playback.currentCells
  }

  addInstrument() {
    // Sync to store so React can pick it up
    this._session.syncSongToStore();
  }

  resize() {
    // React handles canvas sizing
  }

  // ========================================
  // Selection state
  // ========================================

  getSelectPos() {
    if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
      return this.select_pos;
    }
  }

  setSelectPos(pos: { x: number; y: number; type: string }) {
    this.select_pos = pos;
  }

  // ========================================
  // Dialog methods - Now using store
  // ========================================

  showSuccess(url: string, songTitle: string, userName: string) {
    store.getState().showSuccessDialog(url, songTitle, userName);
  }

  showError() {
    store.getState().showErrorDialog();
  }

  closeDialog() {
    store.getState().closeDialog();
  }
}
