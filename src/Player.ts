/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { Mixer } from './Mixer';
import { Session } from './Session';
import { Sidebar } from './Sidebar';
import { Synth } from './Synth';
import { Sampler } from './Sampler';
import { PlayerView } from './PlayerView';
import { MutekiTimer } from './MutekiTimer';
import {
  isNoteKey,
  isNoteScale,
  KEY_LIST,
  type NoteKey,
  type NoteScale,
} from './Constant';

declare global {
  interface Window {
    keyboard: any;
  }
}

export type InstrumentType = 'REZ' | 'SAMPLER';

const T = new MutekiTimer();

export class Player {
  bpm: number = 120;
  duration: number = 500; // msec
  key: NoteKey = 'A';
  scale: NoteScale = 'Major';
  is_playing: boolean = false;
  time: number = 0;
  scene: { bpm: number; key: string; scale: string };
  num_id: number = 0;
  context: AudioContext;
  synth: (Synth | Sampler)[] = []; // TODO: add type
  mixer: Mixer;
  session: Session;
  sidebar: Sidebar;
  synth_now: any;
  synth_pos: number = 0;
  scene_length: number = 32;
  view: PlayerView;
  song: any;

  constructor(ctx: AudioContext) {
    this.scene = { bpm: this.bpm, key: this.key, scale: this.scale };

    this.context = ctx;

    this.mixer = new Mixer(this.context, this);
    this.session = new Session(this.context, this);
    this.sidebar = new Sidebar(this.context, this, this.session, this.mixer);

    this.addSynth(0);
    this.synth_now = this.synth[0];

    this.view = new PlayerView(this);
  }

  setBPM(bpm: number) {
    this.bpm = bpm;
    this.scene.bpm = this.bpm;

    // @duration = (60000.0 / @bpm) / 8.0
    this.duration = 7500.0 / this.bpm;
    for (const s of this.synth) {
      s.setDuration(this.duration);
    }

    this.sidebar.setBPM(this.bpm);
  }

  setKey(key: string) {
    if (!isNoteKey(key)) {
      throw new TypeError(`Invalid Key: ${key}`);
    }

    this.key = key;
    this.scene.key = this.key;
    for (var s of Array.from(this.synth)) {
      s.setKey(this.key);
    }

    this.sidebar.setKey(this.key);
  }

  setScale(scale: string) {
    if (!isNoteScale(scale)) {
      throw new TypeError(`Invalid scale: ${scale}`);
    }

    this.scale = scale;
    this.scene.scale = this.scale;

    for (const s of this.synth) {
      s.setScale(this.scale);
    }

    this.sidebar.setScale(this.scale);
  }

  isPlaying(): boolean {
    return this.is_playing;
  }

  play() {
    this.is_playing = true;
    this.session.play();

    T.setTimeout(() => {
      for (const s of this.synth) {
        s.play();
      }
      this.playNext();
    }, 150);
  }

  stop() {
    for (var s of Array.from(this.synth)) {
      s.stop();
    }
    this.is_playing = false;
    this.view.viewStop();
    return (this.time = 0);
  }

  pause() {
    for (var s of Array.from(this.synth)) {
      s.pause(this.time);
    }
    this.is_playing = false;
  }

  forward() {
    if (this.time + 32 > this.scene_length) {
      this.session.nextMeasure(this.synth);
    }
    this.time = (this.time + 32) % this.scene_length;
    this.synth_now.redraw(this.time);
  }

  backward(force: boolean) {
    if (force) {
      if (this.time >= 32) {
        this.time = (this.time - 32) % this.scene_length;
      }
    } else {
      if (this.time % 32 < 3 && this.time >= 32) {
        this.time = (this.time - 32 - (this.time % 32)) % this.scene_length;
      } else {
        this.time = this.time - (this.time % 32);
      }
    }
    this.synth_now.redraw(this.time);
  }

  toggleLoop(): boolean {
    return this.session.toggleLoop();
  }

  noteOn(note: number, force: boolean) {
    return this.synth_now.noteOn(note, force);
  }
  noteOff(force: boolean) {
    return this.synth_now.noteOff(force);
  }

  playNext() {
    if (this.is_playing) {
      if (this.time >= this.scene_length) {
        this.time = 0;
      }

      for (var s of Array.from(this.synth)) {
        s.playAt(this.time);
      }

      if (this.time % 32 === 31 && this.time + 32 > this.scene_length) {
        this.session.nextMeasure(this.synth);
      }

      if (this.time % 8 === 0) {
        this.session.beat();
      }

      this.time++;
      return T.setTimeout(() => this.playNext(), this.duration);
    } else {
      return this.stop();
    }
  }

  addSynth(scene_pos?: number, name?: string) {
    const s = new Synth(this.context, this.num_id++, this, name);
    s.setScale(this.scene.scale);
    s.setKey(this.scene.key as NoteKey);

    this.synth.push(s);
    this.mixer.addSynth(s);
    return this.session.addSynth(s, scene_pos);
  }

  addSampler(scene_pos?: number, name?: string) {
    const s = new Sampler(this.context, this.num_id++, this, name);
    this.synth.push(s);
    this.mixer.addSynth(s);
    return this.session.addSynth(s, scene_pos);
  }

  // Called by instruments.
  changeSynth(idx: number, type: InstrumentType) {
    const s_old = this.synth[idx];

    let s_new: Synth | Sampler; // TODO: add type Instrument
    if (type === 'REZ') {
      s_new = new Synth(this.context, idx, this, s_old.name);
      s_new.setScale(this.scene.scale);
      s_new.setKey(this.scene.key as NoteKey);
    } else {
      s_new = new Sampler(this.context, idx, this, s_old.name);
    }

    this.synth_now = this.synth[idx] = s_new;
    this.synth_now = s_new;

    this.mixer.changeSynth(idx, s_new);
    this.session.changeSynth(idx, type, s_new);
    this.view.changeSynth(idx, type);

    return s_new;
  }

  // Called by PlayerView.
  moveRight(next_idx: number) {
    if (next_idx === this.synth.length) {
      this.addSynth();
      this.session.play();
    }

    this.synth[next_idx - 1].deactivate();
    this.synth_now = this.synth[next_idx];
    this.synth_now.activate(next_idx);
    this.synth_pos++;
    return window.keyboard.setMode('SYNTH');
  }

  moveLeft(next_idx: number) {
    this.synth[next_idx + 1].deactivate();
    this.synth_now = this.synth[next_idx];
    this.synth_now.activate(next_idx);
    this.synth_pos--;
    return window.keyboard.setMode('SYNTH');
  }

  moveTop() {
    window.keyboard.setMode('MIXER');
  }

  moveBottom() {
    window.keyboard.setMode('SYNTH');
  }

  moveTo(synth_num: number) {
    this.view.moveBottom();
    if (synth_num < this.synth_pos) {
      while (synth_num !== this.synth_pos) {
        this.view.moveLeft();
      }
    } else {
      while (synth_num !== this.synth_pos) {
        this.view.moveRight();
      }
    }
  }

  solo(solos: number[]) {
    if (solos.length === 0) {
      for (let s of Array.from(this.synth)) {
        s.unmute();
      }
      return;
    }

    for (let s of Array.from(this.synth)) {
      if (Array.from(solos).includes(s.id + 1)) {
        s.unmute();
      } else {
        s.mute();
      }
    }
  }

  readSong(song: any) {
    this.song = song;
    this.synth = [];
    this.num_id = 0;
    this.mixer.empty();
    this.session.empty();
    this.view.empty();

    for (let i = 0; i < this.song.tracks.length; i++) {
      if (
        this.song.tracks[i].type == null ||
        this.song.tracks[i].type === 'REZ'
      ) {
        this.addSynth(0, this.song.tracks[i].name);
      }
      if (this.song.tracks[i].type === 'SAMPLER') {
        this.addSampler(0, this.song.tracks[i].name);
      }
    }

    this.synth_now = this.synth[0];

    this.readScene(this.song.master[0]);
    this.setSceneLength(this.song.master.length);
    for (let i = 0; i < this.song.tracks.length; i++) {
      this.synth[i].setParam(this.song.tracks[i]);
    }

    this.session.setSynth(this.synth);
    this.session.readSong(this.song);
    this.mixer.readParam(this.song.mixer);

    this.view.setSynthNum(this.synth.length, this.synth_pos);
    return this.resetSceneLength();
  }

  readScene(scene: any) {
    if (scene.bpm != null) {
      this.setBPM(scene.bpm);
      this.view.setBPM(scene.bpm);
    }
    if (scene.key != null) {
      this.setKey(scene.key);
      this.view.setKey(scene.key);
    }
    if (scene.scale != null) {
      this.setScale(scene.scale);
      this.view.setScale(scene.scale);
    }
    return this.view.setParam(scene.bpm, scene.key, scene.scale);
  }

  getScene() {
    return this.scene;
  }

  setSceneLength(scene_length: number) {
    this.scene_length = scene_length;
  }

  resetSceneLength() {
    this.scene_length = 0;
    for (const s of this.synth) {
      this.scene_length = Math.max(this.scene_length, s.pattern.length);
    }
  }
}
