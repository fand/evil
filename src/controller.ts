/**
 * Controller layer for side-effect actions.
 * Holds references to models and provides action methods.
 * Views should use this instead of directly calling model methods.
 */

import type { Player } from './Player';
import type { Session } from './Session';

class AppController {
  private _player: Player | null = null;

  get player(): Player {
    if (!this._player) {
      throw new Error('Player not registered. Call controller.registerPlayer() first.');
    }
    return this._player;
  }

  get session(): Session {
    return this.player.session;
  }

  registerPlayer(player: Player) {
    this._player = player;
  }

  // ========================================
  // Playback Actions
  // ========================================

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  stop() {
    this.player.stop();
  }

  toggleLoop(): boolean {
    return this.player.toggleLoop();
  }

  forward() {
    this.player.forward();
  }

  backward(force: boolean) {
    this.player.backward(force);
  }

  // ========================================
  // Scene/BPM/Key/Scale Actions
  // ========================================

  setBPM(bpm: number) {
    this.player.setBPM(bpm);
  }

  setKey(key: string) {
    this.player.setKey(key);
  }

  setScale(scale: string) {
    this.player.setScale(scale);
  }

  // ========================================
  // Navigation Actions
  // ========================================

  moveRight(idx: number) {
    this.player.moveRight(idx);
  }

  moveLeft(idx: number) {
    this.player.moveLeft(idx);
  }

  moveTop() {
    this.player.moveTop();
  }

  moveBottom() {
    this.player.moveBottom();
  }

  // ========================================
  // Session Actions
  // ========================================

  cuePattern(synthNum: number, patNum: number) {
    this.session.cuePattern(synthNum, patNum);
  }

  cueScene(sceneNum: number) {
    this.session.cueScene(sceneNum);
  }

  saveSong() {
    this.session.saveSong();
  }

  editPattern(idx: number, patNum: number) {
    return this.session.editPattern(idx, patNum);
  }

  savePattern(x: number, y: number | undefined) {
    this.session.savePattern(x, y);
  }

  loadPattern(pat: unknown, idx: number, patNum: number) {
    this.session.loadPattern(pat as Parameters<Session['loadPattern']>[0], idx, patNum);
  }

  loadTrack(song: unknown, src: { x: number; y: number }, dst: { x: number; y: number }) {
    return this.session.loadTrack(song as Parameters<Session['loadTrack']>[0], src, dst);
  }

  loadMaster(pat: unknown, patNum: number) {
    this.session.loadMaster(pat as Parameters<Session['loadMaster']>[0], patNum);
  }

  // ========================================
  // Sidebar Actions
  // ========================================

  showSidebar(pos: { x: number; y: number; type: string }) {
    // Guard: controller may not be ready during view construction
    if (!this._player) return;
    this.player.sidebar.show(pos);
  }

  // ========================================
  // Instrument Actions
  // ========================================

  get instrumentsCount(): number {
    return this.player.instruments.length;
  }

  getInstrument(idx: number) {
    return this.player.instruments[idx];
  }

  changeInstrumentType(id: number, type: string) {
    if (type !== 'REZ' && type !== 'SAMPLER') {
      throw new TypeError(`Invalid instrument type: ${type}`);
    }
    const oldInst = this.player.instruments[id];
    const newInst = this.player.changeInstrument(id, type);

    // DOM replacement and cleanup (previously in Synth.changeSynth)
    oldInst.view.dom.replaceWith(newInst.view.dom);
    oldInst.noteOff(true);
    oldInst.disconnect();

    return newInst;
  }

  setSynthName(id: number, name: string) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.name = name;
      this.session.setTrackName(id, name);
    }
  }

  setPatternName(id: number, name: string) {
    this.session.setPatternName(id, name);
  }

  inputPatternName(id: number, name: string) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.pattern_name = name;
      this.session.setPatternName(id, name);
    }
  }

  plusPattern(id: number) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.plusPattern();
    }
  }

  minusPattern(id: number) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.minusPattern();
    }
  }

  selectSample(id: number, sampleIdx: number) {
    const inst = this.player.instruments[id];
    if (inst && 'selectSample' in inst) {
      (inst as { selectSample: (idx: number) => void }).selectSample(sampleIdx);
    }
  }

  setInstrumentName(id: number, name: string) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.name = name;
      this.session.setTrackName(id, name);
      if ('setInstrumentName' in inst.view) {
        (inst.view as { setInstrumentName: (name: string) => void }).setInstrumentName(name);
      }
    }
  }

  setInstrumentPatternName(id: number, name: string) {
    const inst = this.player.instruments[id];
    if (inst) {
      inst.pattern_name = name;
      inst.view.setPatternName(name);
    }
  }

  // ========================================
  // Mixer Actions
  // ========================================

  setMixerGains(trackGains: number[], masterGain: number) {
    if (!this._player) return;
    this.player.mixer.setGains(trackGains, masterGain);
  }

  setMixerPans(trackPans: number[], masterPan: number) {
    if (!this._player) return;
    this.player.mixer.setPans(trackPans, masterPan);
  }

  getTrackGains(): number[] {
    if (!this._player) return [];
    return this.player.mixer.gain_tracks;
  }

  getMasterGain(): number {
    if (!this._player) return 1.0;
    return this.player.mixer.gain_master;
  }
}

export const controller = new AppController();
