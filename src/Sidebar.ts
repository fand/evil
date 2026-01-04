import type { Mixer } from './Mixer';
import type { Player } from './Player';
import type { Session } from './Session';
import type { Scene, Song } from './Song';
import { store } from './store';

class Sidebar {
  ctx: AudioContext;
  player: Player;
  session: Session;
  mixer: Mixer;
  sidebar_pos: { x: number; y: number; type: string };
  select_pos: { x: number; y: number; type: string } = {
    x: -1,
    y: -1,
    type: '',
  };

  get song(): Song {
    return this.session.song;
  }

  constructor(
    ctx: AudioContext,
    player: Player,
    session: Session,
    mixer: Mixer
  ) {
    this.addMasterEffect = this.addMasterEffect.bind(this);
    this.addTracksEffect = this.addTracksEffect.bind(this);
    this.ctx = ctx;
    this.player = player;
    this.session = session;
    this.mixer = mixer;
    this.sidebar_pos = { x: 0, y: 1, type: 'master' };
  }

  show(select_pos: { x: number; y: number; type: string }) {
    this.select_pos = select_pos;
    if (this.select_pos.type === 'tracks') {
      if (
        this.sidebar_pos.x === this.select_pos.x &&
        this.sidebar_pos.type === this.select_pos.type
      ) {
        return;
      }
      this.saveTracksEffect();
      this.sidebar_pos = this.select_pos;
      const instrument = this.player.instruments[this.select_pos.x];
      if (!instrument) return;
      store.getState().setCurrentInstrument(this.select_pos.x);
      store.getState().triggerEffectsUpdate();
    } else {
      if (
        this.sidebar_pos.y === this.select_pos.y &&
        this.sidebar_pos.type === this.select_pos.type
      ) {
        return;
      }
      this.sidebar_pos = this.select_pos;
      const scene = this.song.master[this.select_pos.y];
      store.getState().setCurrentInstrument(-1);
      store.getState().setScene(scene);
    }
  }

  saveMaster(obj: Partial<Scene>) {
    if (this.sidebar_pos.y === -1) {
      return;
    }
    return this.session.saveMaster(this.sidebar_pos.y, obj as Scene);
  }

  saveTracksEffect() {
    if (this.sidebar_pos.type === 'master') {
      return;
    }
    return this.session.saveTracksEffect(this.sidebar_pos);
  }

  addMasterEffect(name: string) {
    return this.mixer.addMasterEffect(name);
  }

  addTracksEffect(name: string) {
    return this.mixer.addTracksEffect(this.sidebar_pos.x, name);
  }

  setBPM(bpm: number) {
    store.getState().setBPM(bpm);
  }

  setKey(key: string) {
    store.getState().setKey(key);
  }

  setScale(scale: string) {
    store.getState().setScale(scale);
  }
}

export { Sidebar };
