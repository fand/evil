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
  type NoteKey,
  type NoteScale,
} from './Constant';
import type { Instrument, InstrumentType } from './Instrument';
import { Song, Scene } from './Song';
import type { Keyboard } from './Keyboard';

declare global {
  interface Window {
    keyboard: Keyboard;
  }
}

const T = new MutekiTimer();

export class Player {
  duration: number = 500; // msec
  is_playing: boolean = false;
  time: number = 0;
  scene: Scene;
  num_id: number = 0;
  context: AudioContext;
  instruments: Instrument[] = [];
  current_instrument: number = 0;
  mixer: Mixer;
  session: Session;
  sidebar: Sidebar;
  scene_length: number = 32;
  view: PlayerView;

  // scene is the single source of truth for bpm/key/scale
  get bpm(): number {
    return this.scene.bpm;
  }

  get key(): NoteKey {
    return this.scene.key as NoteKey;
  }

  get scale(): NoteScale {
    return this.scene.scale as NoteScale;
  }

  get song(): Song {
    return this.session.song;
  }

  constructor(ctx: AudioContext) {
    // Initialize scene first (single source of truth)
    this.scene = { name: '', bpm: 120, key: 'A', scale: 'Major' };

    this.context = ctx;

    this.mixer = new Mixer(this.context, this);
    this.session = new Session(this.context, this);
    this.sidebar = new Sidebar(this.context, this, this.session, this.mixer);

    this.addSynth(0);

    this.view = new PlayerView(this);
  }

  setBPM(bpm: number) {
    this.scene.bpm = bpm;

    // @duration = (60000.0 / @bpm) / 8.0
    this.duration = 7500.0 / this.bpm;
    for (const s of this.instruments) {
      s.setDuration(this.duration);
    }

    this.sidebar.setBPM(this.bpm);
  }

  setKey(key: string) {
    if (!isNoteKey(key)) {
      throw new TypeError(`Invalid Key: ${key}`);
    }

    this.scene.key = key;
    for (const s of this.instruments) {
      s.setKey(this.key);
    }

    this.sidebar.setKey(this.key);
  }

  setScale(scale: string) {
    if (!isNoteScale(scale)) {
      throw new TypeError(`Invalid scale: ${scale}`);
    }

    this.scene.scale = scale;

    for (const s of this.instruments) {
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
      for (const s of this.instruments) {
        s.play();
      }
      this.playNext();
    }, 150);
  }

  stop() {
    for (const s of this.instruments) {
      s.stop();
    }
    this.is_playing = false;
    this.view.viewStop();
    this.time = 0;
  }

  pause() {
    for (const s of this.instruments) {
      s.pause(this.time);
    }
    this.is_playing = false;
  }

  forward() {
    if (this.time + 32 > this.scene_length) {
      this.session.nextMeasure(this.instruments);
    }
    this.time = (this.time + 32) % this.scene_length;
    this.instruments[this.current_instrument].redraw(this.time);
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
    this.instruments[this.current_instrument].redraw(this.time);
  }

  toggleLoop(): boolean {
    return this.session.toggleLoop();
  }

  noteOn(note: number, force: boolean) {
    this.instruments[this.current_instrument].noteOn(note, force);
  }
  noteOff(force: boolean) {
    this.instruments[this.current_instrument].noteOff(force);
  }

  playNext() {
    if (this.is_playing) {
      if (this.time >= this.scene_length) {
        this.time = 0;
      }

      for (const s of this.instruments) {
        s.playAt(this.time);
      }

      if (this.time % 32 === 31 && this.time + 32 > this.scene_length) {
        this.session.nextMeasure(this.instruments);
      }

      if (this.time % 8 === 0) {
        this.session.beat();
      }

      this.time++;
      T.setTimeout(() => this.playNext(), this.duration);
    } else {
      this.stop();
    }
  }

  addSynth(idx?: number, name?: string) {
    const s = new Synth(this.context, this.num_id++, this, name);
    s.setScale(this.scene.scale);
    s.setKey(this.scene.key as NoteKey);

    this.instruments.push(s);
    this.mixer.addInstrument(s);
    this.session.addInstrument(s, idx);
  }

  addSampler(idx?: number, name?: string) {
    const s = new Sampler(this.context, this.num_id++, this, name);
    this.instruments.push(s);
    this.mixer.addInstrument(s);
    this.session.addInstrument(s, idx);
  }

  // Called by instruments.
  changeInstrument(idx: number, type: InstrumentType) {
    const instOld = this.instruments[idx];

    let inst: Instrument;
    if (type === 'REZ') {
      inst = new Synth(this.context, idx, this, instOld.name);
      inst.setScale(this.scene.scale);
      inst.setKey(this.scene.key as NoteKey);
    } else {
      inst = new Sampler(this.context, idx, this, instOld.name);
    }

    this.instruments[idx] = inst;

    this.mixer.changeInstrument(idx, inst);
    this.session.changeInstrument(idx, type, inst);
    this.view.changeInstrument(idx, type);

    return inst;
  }

  // Called by PlayerView.
  moveRight(next_idx: number) {
    if (next_idx === this.instruments.length) {
      this.addSynth();
      this.session.play();
    }

    this.instruments[this.current_instrument].deactivate();
    this.current_instrument = next_idx;
    this.instruments[this.current_instrument].activate();
    window.keyboard.setMode('SYNTH');
  }

  moveLeft(next_idx: number) {
    this.instruments[this.current_instrument].deactivate();
    this.current_instrument = next_idx;
    this.instruments[this.current_instrument].activate();
    window.keyboard.setMode('SYNTH');
  }

  moveTop() {
    window.keyboard.setMode('MIXER');
  }

  moveBottom() {
    window.keyboard.setMode('SYNTH');
  }

  moveTo(inst_idx: number) {
    this.view.moveBottom();
    if (inst_idx < this.current_instrument) {
      while (inst_idx !== this.current_instrument) {
        this.view.moveLeft();
      }
    } else {
      while (inst_idx !== this.current_instrument) {
        this.view.moveRight();
      }
    }
  }

  solo(solos: number[]) {
    if (solos.length === 0) {
      for (const s of this.instruments) {
        s.unmute();
      }
      return;
    }

    for (const s of this.instruments) {
      if (solos.includes(s.id + 1)) {
        s.unmute();
      } else {
        s.mute();
      }
    }
  }

  loadSong(song: Song) {
    this.instruments = [];
    this.num_id = 0;
    this.mixer.empty();
    this.session.empty();
    this.view.empty();

    // Set song to Session (single source of truth)
    this.session.song = song;

    // Cache track count to avoid infinite loop (addSynth modifies song.tracks)
    const trackCount = this.song.tracks.length;
    for (let i = 0; i < trackCount; i++) {
      if (!this.song.tracks[i].type || this.song.tracks[i].type === 'REZ') {
        this.addSynth(0, this.song.tracks[i].name);
      }
      if (this.song.tracks[i].type === 'SAMPLER') {
        this.addSampler(0, this.song.tracks[i].name);
      }
    }

    this.loadScene(this.song.master[0]);
    this.setSceneLength(this.song.master.length);
    for (let i = 0; i < this.song.tracks.length; i++) {
      this.instruments[i].setParam(this.song.tracks[i]);
    }

    this.session.setInstrument(this.instruments);
    this.session.loadSong();
    this.mixer.loadParam(this.song.mixer);

    this.view.setInstrumentCount(
      this.instruments.length,
      this.current_instrument
    );
    this.resetSceneLength();
  }

  loadScene(scene: Partial<Scene>) {
    if (scene.bpm) {
      this.setBPM(scene.bpm);
      this.view.setBPM(scene.bpm);
    }
    if (scene.key) {
      this.setKey(scene.key);
      this.view.setKey(scene.key);
    }
    if (scene.scale) {
      this.setScale(scene.scale);
      this.view.setScale(scene.scale);
    }
    this.view.setParam(scene.bpm, scene.key, scene.scale);
  }

  getScene() {
    return this.scene;
  }

  setSceneLength(scene_length: number) {
    this.scene_length = scene_length;
  }

  resetSceneLength() {
    this.scene_length = 0;
    for (const s of this.instruments) {
      this.scene_length = Math.max(this.scene_length, s.pattern.length);
    }
  }
}
