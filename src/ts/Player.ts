/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import Mixer from './Mixer';
import Session from './Session';
import Sidebar from './Sidebar';
import Synth from './Synth';
import Sampler from './Sampler';
import PlayerView from './PlayerView';
import MutekiTimer from './MutekiTimer';

declare const CONTEXT: AudioContext;
declare global {
  interface Window {
    keyboard: any;
  }
}

const T = new MutekiTimer();

class Player {
  bpm: number;
  duration: number;
  key: string;
  scale: string;
  is_playing: boolean;
  time: number;
  scene: { bpm: number; key: string; scale: string };
  num_id: number;
  context: AudioContext;
  synth: any[];
  mixer: Mixer;
  session: Session;
  sidebar: Sidebar;
  synth_now: any;
  synth_pos: number;
  scene_length: number;
  view: PlayerView;
  song: any;

  constructor(ctx: AudioContext) {
    this.bpm = 120;
    this.duration = 500; // msec
    this.key = 'A';
    this.scale = 'Major';
    this.is_playing = false;
    this.time = 0;
    this.scene = { bpm: this.bpm, key: this.key, scale: this.scale };

    this.num_id = 0;
    this.context = ctx;
    this.synth = [];

    this.mixer = new Mixer(this.context, this);
    this.session = new Session(this.context, this);
    this.sidebar = new Sidebar(this.context, this, this.session, this.mixer);

    this.addSynth(0);
    this.synth_now = this.synth[0];
    this.synth_pos = 0;
    this.scene_length = 32;

    this.view = new PlayerView(this);
  }

  setBPM(bpm) {
    this.bpm = bpm;
    this.scene.bpm = this.bpm;

    // @duration = (60000.0 / @bpm) / 8.0
    this.duration = 7500.0 / this.bpm;
    for (var s of Array.from(this.synth)) {
      s.setDuration(this.duration);
    }

    return this.sidebar.setBPM(this.bpm);
  }

  setKey(key) {
    this.key = key;
    this.scene.key = this.key;
    for (var s of Array.from(this.synth)) {
      s.setKey(this.key);
    }

    return this.sidebar.setKey(this.key);
  }

  setScale(scale) {
    this.scale = scale;
    this.scene.scale = this.scale;
    for (var s of Array.from(this.synth)) {
      s.setScale(this.scale);
    }

    return this.sidebar.setScale(this.scale);
  }

  isPlaying() {
    return this.is_playing;
  }

  play() {
    this.is_playing = true;
    this.session.play();
    return T.setTimeout(() => {
      // s.play() for s in @synth
      return this.playNext();
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
    return (this.is_playing = false);
  }

  forward() {
    if (this.time + 32 > this.scene_length) {
      this.session.nextMeasure(this.synth);
    }
    this.time = (this.time + 32) % this.scene_length;
    return this.synth_now.redraw(this.time);
  }

  backward(force) {
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
    return this.synth_now.redraw(this.time);
  }

  toggleLoop() {
    return this.session.toggleLoop();
  }

  noteOn(note, force) {
    return this.synth_now.noteOn(note, force);
  }
  noteOff(force) {
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
    s.setKey(this.scene.key);

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
  changeSynth(id, type) {
    let s_new;
    const s_old = this.synth[id];

    if (type === 'REZ') {
      s_new = new Synth(this.context, id, this, s_old.name);
      s_new.setScale(this.scene.scale);
      s_new.setKey(this.scene.key);
    } else if (type === 'SAMPLER') {
      s_new = new Sampler(this.context, id, this, s_old.name);
    }

    this.synth_now = this.synth[id] = s_new;
    this.synth_now = s_new;

    this.mixer.changeSynth(id, s_new);
    this.session.changeSynth(id, type, s_new);
    this.view.changeSynth(id, type);

    return s_new;
  }

  // Called by PlayerView.
  moveRight(next_idx) {
    if (next_idx === this.synth.length) {
      this.addSynth();
      this.session.play();
    }

    this.synth[next_idx - 1].inactivate();
    this.synth_now = this.synth[next_idx];
    this.synth_now.activate(next_idx);
    this.synth_pos++;
    return window.keyboard.setMode('SYNTH');
  }

  moveLeft(next_idx) {
    this.synth[next_idx + 1].inactivate();
    this.synth_now = this.synth[next_idx];
    this.synth_now.activate(next_idx);
    this.synth_pos--;
    return window.keyboard.setMode('SYNTH');
  }

  moveTop() {
    return window.keyboard.setMode('MIXER');
  }

  moveBottom() {
    return window.keyboard.setMode('SYNTH');
  }

  moveTo(synth_num) {
    this.view.moveBottom();
    if (synth_num < this.synth_pos) {
      return (() => {
        const result = [];
        while (synth_num !== this.synth_pos) {
          result.push(this.view.moveLeft());
        }
        return result;
      })();
    } else {
      return (() => {
        const result1 = [];
        while (synth_num !== this.synth_pos) {
          result1.push(this.view.moveRight());
        }
        return result1;
      })();
    }
  }

  solo(solos) {
    let s;
    if (solos.length === 0) {
      for (s of Array.from(this.synth)) {
        s.demute();
      }
      return;
    }
    return (() => {
      const result = [];
      for (s of Array.from(this.synth)) {
        if (Array.from(solos).includes(s.id + 1)) {
          result.push(s.demute());
        } else {
          result.push(s.mute());
        }
      }
      return result;
    })();
  }

  readSong(song) {
    let i;
    let asc, end;
    let asc1, end1;
    this.song = song;
    this.synth = [];
    this.num_id = 0;
    this.mixer.empty();
    this.session.empty();
    this.view.empty();

    for (
      i = 0, end = this.song.tracks.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
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
    for (
      i = 0, end1 = this.song.tracks.length, asc1 = 0 <= end1;
      asc1 ? i < end1 : i > end1;
      asc1 ? i++ : i--
    ) {
      this.synth[i].setParam(this.song.tracks[i]);
    }

    this.session.setSynth(this.synth);
    this.session.readSong(this.song);
    this.mixer.readParam(this.song.mixer);

    this.view.setSynthNum(this.synth.length, this.synth_pos);
    return this.resetSceneLength();
  }

  clearSong() {
    this.synth = [];
    return (this.num_id = 0);
  }

  readScene(scene) {
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

  setSceneLength(scene_length) {
    this.scene_length = scene_length;
  }

  resetSceneLength(_l?: number) {
    this.scene_length = 0;
    return Array.from(this.synth).map(
      (s) => (this.scene_length = Math.max(this.scene_length, s.pattern.length))
    );
  }

  showSuccess(url) {
    console.log('success!');
    return console.log(url);
  }

  showError(error) {
    return console.log(error);
  }
}

export default Player;
