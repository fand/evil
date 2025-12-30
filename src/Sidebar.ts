import type { Mixer } from './Mixer';
import type { Player } from './Player';
import type { Session } from './Session';
import { SidebarView } from './SidebarView';
import { Song } from './Song';

class Sidebar {
  ctx: AudioContext;
  player: Player;
  session: Session;
  mixer: Mixer;
  sidebar_pos: { x: number; y: number; type: string };
  view: SidebarView;
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
    this.view = new SidebarView(this);
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
      this.saveTracksEffect(this.sidebar_pos.x);
      this.sidebar_pos = this.select_pos;
      return this.view.showTracks(this.player.instruments[this.select_pos.x]);
    } else {
      if (
        this.sidebar_pos.y === this.select_pos.y &&
        this.sidebar_pos.type === this.select_pos.type
      ) {
        return;
      }
      this.sidebar_pos = this.select_pos;
      return this.view.showMaster(this.song.master[this.select_pos.y]);
    }
  }

  saveMaster(obj: any) {
    if (this.sidebar_pos.y === -1) {
      return;
    }
    return this.session.saveMaster(this.sidebar_pos.y, obj);
  }

  saveTracksEffect() {
    if (this.sidebar_pos.type === 'master') {
      return;
    } // TODO: make sure this is impossible / delete this line
    //obj = @view.saveTracksEffect()
    //@session.saveTracksEffect(@sidebar_pos, obj)
    return this.session.saveTracksEffect(this.sidebar_pos);
  }

  addMasterEffect(name: string) {
    return this.mixer.addMasterEffect(name);
  }

  addTracksEffect(name: string) {
    return this.mixer.addTracksEffect(this.sidebar_pos.x, name);
  }

  setBPM(bpm: number) {
    return this.view.setBPM(bpm);
  }

  setKey(key: string) {
    return this.view.setKey(key);
  }

  setScale(scale: string) {
    return this.view.setScale(scale);
  }
}

export { Sidebar };
