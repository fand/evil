import { Mixer } from './Mixer';
import { Session } from './Session';
import { Sidebar } from './Sidebar';
import { Synth } from './Synth';
import { Sampler } from './Sampler';
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
import { store } from './store';
import { controller } from './controller';

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

    // Initialize BPM (sets duration and syncs to store/sidebar)
    this.setBPM(this.scene.bpm);

    // Register with controller for Views to access
    controller.registerPlayer(this);
  }

  setBPM(bpm: number) {
    this.scene.bpm = bpm;
    store.getState().setBPM(bpm);

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
    store.getState().setKey(key);
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
    store.getState().setScale(scale);

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
    store.getState().setPlaying(true);
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
    store.getState().setPlaying(false);
    // UI update is handled by PlayerView's store subscription
    this.time = 0;
    store.getState().setTime(0);
  }

  pause() {
    for (const s of this.instruments) {
      s.pause(this.time);
    }
    this.is_playing = false;
    store.getState().setPlaying(false);
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
    const isLoop = this.session.toggleLoop();
    store.getState().toggleLoop(); // sync with store
    return isLoop;
  }

  noteOn(note: number, force: boolean) {
    const inst = this.instruments[this.current_instrument];
    if (inst) inst.noteOn(note, force);
  }
  noteOff(force: boolean) {
    const inst = this.instruments[this.current_instrument];
    if (inst) inst.noteOff(force);
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
      // Reset time before syncing to store to prevent React components from seeing out-of-bounds values
      if (this.time >= this.scene_length) {
        this.time = 0;
      }
      store.getState().setTime(this.time);
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
    // React NavigationButtons handles visibility via state

    return inst;
  }

  // Called by PlayerView.
  moveRight(next_idx: number) {
    if (next_idx === this.instruments.length) {
      this.addSynth();
      this.session.play();
    }

    this.current_instrument = next_idx;
    store.getState().setCurrentInstrument(next_idx);
    // activate/deactivate now triggered by store subscription in SynthView/SamplerView
    window.keyboard.setMode('SYNTH');
  }

  moveLeft(next_idx: number) {
    this.current_instrument = next_idx;
    store.getState().setCurrentInstrument(next_idx);
    // activate/deactivate now triggered by store subscription in SynthView/SamplerView
    window.keyboard.setMode('SYNTH');
  }

  moveTop() {
    window.keyboard.setMode('MIXER');
  }

  moveBottom() {
    window.keyboard.setMode('SYNTH');
  }

  moveTo(inst_idx: number) {
    // Navigate to a specific instrument
    // This is called by Session when double-clicking a cell
    // React NavigationButtons handles the visual navigation
    const instrumentsEl = document.getElementById('instruments');
    const wrapperEl = document.getElementById('wrapper');

    // Move to instruments view (bottom)
    if (wrapperEl) {
      wrapperEl.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
    }
    window.keyboard.setMode('SYNTH');

    // Navigate to the target instrument
    this.current_instrument = inst_idx;
    store.getState().setCurrentInstrument(inst_idx);

    if (instrumentsEl) {
      instrumentsEl.style.webkitTransform = `translate3d(${-1110 * inst_idx}px, 0px, 0px)`;
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
    document.getElementById('instruments')?.replaceChildren(); // Clear instruments DOM

    // Set song to Session and Store
    this.session.song = song;
    store.getState().setSong(song);

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
    for (let i = 0; i < trackCount; i++) {
      this.instruments[i].setParam(this.song.tracks[i]);
    }

    this.session.setInstrument(this.instruments);
    this.session.loadSong();
    this.mixer.loadParam(this.song.mixer);

    // React NavigationButtons handles instrument count via controller.instrumentsCount
    this.resetSceneLength();
  }

  loadScene(scene: Partial<Scene>) {
    // setBPM/setKey/setScale update the store, React will react
    if (scene.bpm) {
      this.setBPM(scene.bpm);
    }
    if (scene.key) {
      this.setKey(scene.key);
    }
    if (scene.scale) {
      this.setScale(scene.scale);
    }
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
