import { SessionView } from './SessionView';
import {
  DEFAULT_SCENE,
  DEFAULT_SONG,
  PatternObject,
  Song,
  Track,
} from './Song';
import $ from 'jquery';
import type { Player } from './Player';
import type { Instrument, InstrumentType } from './Instrument';

// Control the patterns for tracks.
class Session {
  ctx: AudioContext;
  player: Player;
  scenes: any[];
  scene_pos: number;
  scene: any;
  scene_length: number;
  current_cells: any[];
  next_pattern_pos: any[];
  next_scene_pos: number | undefined;
  is_loop: boolean;
  is_waiting_next_pattern: boolean;
  is_waiting_next_scene: boolean;
  cue_queue: any[];
  song: Song;
  view: SessionView;
  instruments: Instrument[] = [];

  constructor(ctx: AudioContext, player: Player) {
    this.ctx = ctx;
    this.player = player;
    this.scenes = [];
    this.scene_pos = 0;
    this.scene = {};
    this.scene_length = 32;

    this.current_cells = [];
    this.next_pattern_pos = [];
    this.next_scene_pos = undefined;

    this.is_loop = true;
    this.is_waiting_next_pattern = false;
    this.is_waiting_next_scene = false;

    this.cue_queue = [];

    this.song = DEFAULT_SONG;

    this.view = new SessionView(this);
  }

  toggleLoop(): boolean {
    return (this.is_loop = !this.is_loop);
  }

  // Read patterns for the next measure.
  nextMeasure(insts: Instrument[], _time?: number) {
    this.instruments = insts;
    if (this.is_loop) {
      if (this.is_waiting_next_scene) {
        return this.nextScene(this.next_scene_pos);
      } else if (this.is_waiting_next_pattern) {
        return this.nextPattern();
      }
    } else {
      return this.nextScene();
    }
  }

  // Read patterns for cued tracks.
  nextPattern() {
    this.savePatterns();

    this.is_waiting_next_pattern = false;
    for (const q of this.cue_queue) {
      const pat = this.song.tracks[q[0]].patterns[q[1]];
      if (pat) {
        this.instruments[q[0]].setPattern(pat);
      }
      this.current_cells[q[0]] = q[1];
    }
    this.view.drawScene(this.scene_pos, this.current_cells);
    this.next_pattern_pos = [];
    this.cue_queue = [];
  }

  // Read patterns for the next scene.
  nextScene(pos?: number) {
    this.savePatterns();

    this.is_waiting_next_scene = false;
    if (pos === undefined) {
      this.scene_pos++;
      pos = this.scene_pos;
    } else {
      this.scene_pos = pos;
    }

    if (this.scene_pos >= this.song.length) {
      this.player.is_playing = false;
      this.view.clearAllActive();
      this.scene_pos = this.next_scene_pos = 0;
      this.current_cells = this.song.tracks.map(() => 0);
      return;
    }

    for (let i = 0; i < this.instruments.length; i++) {
      const pat = this.song.tracks[i].patterns[this.scene_pos];
      if (pat == null) {
        continue;
      }

      if (pat) {
        this.instruments[i].setPattern(pat);
        this.scene_length = Math.max(this.scene_length, pat.pattern.length);
        this.current_cells[i] = pos;
      }
    }

    if (this.song.master[this.scene_pos]) {
      this.player.loadScene(this.song.master[this.scene_pos]);
    }
    this.player.setSceneLength(this.scene_length);
    this.view.loadSong(this.current_cells);
    this.view.drawScene(this.scene_pos, this.current_cells);
    this.next_pattern_pos = [];
    this.next_scene_pos = undefined;
    this.cue_queue = [];
  }

  // Display current states via SessionView.
  play() {
    this.view.drawScene(this.scene_pos, this.current_cells);
  }

  beat() {
    if (this.is_waiting_next_scene) {
      this.view.beat(true, [0, this.next_scene_pos]);
    } else {
      this.view.beat(false, this.cue_queue);
    }
  }

  // Cue patterns to play next.
  cuePattern(synth_num: number, pat_num: number) {
    this.is_waiting_next_pattern = true;
    this.next_pattern_pos[synth_num] = pat_num;
    this.cue_queue.push([synth_num, pat_num]);
  }

  cueScene(scene_num: number) {
    this.is_waiting_next_scene = true;
    this.next_scene_pos = scene_num;
  }

  addInstrument(s: Instrument, _pos?: number) {
    const pos = _pos ? _pos : this.scene_pos;

    const name = s.id + '-' + pos;
    s.setPatternName(name);

    const patterns: (PatternObject | undefined)[] = [];
    patterns[pos] = { name: s.pattern_name, pattern: s.pattern };
    const s_obj: Track = {
      id: s.id,
      type: s.type,
      name: s.name,
      patterns,
      gain: 1.0,
      pan: 0.0,
    };

    this.song.tracks.push(s_obj);
    this.current_cells.push(pos);

    this.view.addInstrument();
  }

  setInstrument(inst: any[]) {
    this.instruments = inst;
  }

  // Read given song, called by Player.
  loadTrack(
    song: Song,
    src: { x: number; y: number },
    dst: { x: number; y: number }
  ) {
    // add master
    this.song = song;
    if (!this.song.master[dst.y]) {
      this.song.master[dst.y] = { ...DEFAULT_SCENE, name: 'section-' + dst.y };
    }
    if (dst.y + 1 > this.song.length) {
      this.song.length = dst.y + 1;
    }

    // Add track pattern
    let dst_x = dst.x;
    if (this.song.tracks.length <= dst.x) {
      dst_x = this.song.tracks.length;

      if (this.song.tracks[src.x].type === 'REZ') {
        this.player.addSynth(dst.y);
      } else if (this.song.tracks[src.x].type === 'SAMPLER') {
        this.player.addSampler(dst.y);
      }
    }

    return this.song.tracks.length - 1;
  }

  loadPattern(pat: any, idx: number, pat_num: number) {
    this.song.tracks[idx].patterns[pat_num] = pat;
    if (!this.song.master[pat_num]) {
      this.song.master[pat_num] = {
        ...DEFAULT_SCENE,
        name: 'section-' + pat_num,
      };
    }
    if (pat_num + 1 > this.song.length) {
      this.song.length = pat_num + 1;
    }
    if (this.current_cells[idx] === pat_num) {
      this.player.instruments[idx].setPattern(pat);
    }
  }

  loadMaster(pat: any, pat_num: number) {
    this.song.master[pat_num] = pat;
    if (pat_num + 1 > this.song.length) {
      this.song.length = pat_num + 1;
    }
  }

  editPattern(idx: number, pat_num: number): [number, number, PatternObject] {
    // add master
    if (!this.song.master[pat_num]) {
      this.song.master[pat_num] = {
        ...DEFAULT_SCENE,
        name: 'section-' + pat_num,
      };
    }
    if (pat_num + 1 > this.song.length) {
      this.song.length = pat_num + 1;
    }

    // add track pattern
    let track_idx = idx;
    if (this.song.tracks.length <= idx) {
      track_idx = this.song.tracks.length;
      this.player.addSynth(pat_num);
    }

    // Save old pattern (for old @current_cells)
    this.savePattern(track_idx, this.current_cells[track_idx]);

    if (this.song.tracks[track_idx].patterns[pat_num]) {
      this.player.instruments[track_idx].setPattern(
        this.song.tracks[track_idx].patterns[pat_num]!
      );
    } else {
      // set new pattern
      const pat_name = track_idx + '-' + pat_num;
      this.player.instruments[track_idx].clearPattern();
      this.player.instruments[track_idx].setPatternName(pat_name);
      this.song.tracks[track_idx].patterns[pat_num] =
        this.player.instruments[track_idx].getPattern();
    }

    // draw
    this.current_cells[track_idx] = pat_num;
    this.view.loadSong(this.current_cells);
    this.player.moveTo(track_idx);

    return [track_idx, pat_num, this.song.tracks[track_idx].patterns[pat_num]!];
  }

  // Save patterns into @song.
  savePatterns() {
    for (let i = 0; i < this.current_cells.length; i++) {
      this.savePattern(i, this.current_cells[i]);
    }
  }

  savePattern(x: number, y: number) {
    this.song.tracks[x].patterns[y] = this.player.instruments[x].getPattern();
  }

  // Save parameters for tracks into @song.
  saveTracks() {
    for (let i = 0; i < this.player.instruments.length; i++) {
      const inst = this.player.instruments[i];
      const track = this.song.tracks[i];
      track.params = inst.getParam();
      track.name = inst.name;
      track.effects = inst.getEffectsParam();
    }
  }

  saveTracksEffect(pos: { x: number }) {
    this.song.tracks[pos.x].effects =
      this.player.instruments[pos.x].getEffectsParam();
  }

  // Save master track into @song.
  saveMaster(y: number, obj: any) {
    this.song.master[y] = obj;
    this.view.loadSong(this.current_cells);
    if (y === this.scene_pos) {
      this.player.loadScene(obj);
    }
  }

  saveMasters() {
    if (this.song.master.length === 0) {
      this.song.master.push(this.player.getScene());
    }
  }

  // Save mixer into @song.
  saveMixer() {
    this.song.mixer = this.player.mixer.getParam();
  }

  saveSong() {
    // Save patterns and parameters into JSON.
    this.savePatterns();
    this.saveTracks();
    this.saveMasters();
    this.saveMixer();
    const song_json = JSON.stringify(this.song);

    // Save the song via ajax.
    $.ajax({
      url: '/api/songs/',
      type: 'POST',
      dataType: 'text',
      data: {
        title: this.song.title,
        creator: this.song.creator,
        json: song_json,
      },
    })
      .done((d) => {
        return this.view.showSuccess(
          d,
          this.song.title ?? '',
          this.song.creator ?? ''
        );
      })
      .fail((err) => {
        return this.view.showError(err);
      });
  }

  // Read the song (uses this.song set by Player).
  loadSong() {
    this.scene_pos = 0;
    this.scene_length = 0;

    for (let i = 0; i < this.song.tracks.length; i++) {
      const pat = this.song.tracks[i].patterns[0];
      if (pat) {
        this.instruments[i].setPattern(pat);
        this.current_cells[i] = 0;
        this.scene_length = Math.max(this.scene_length, pat.pattern.length);
      } else {
        this.current_cells[i] = undefined;
      }
    }

    this.view.loadSong(this.current_cells);
  }

  // Set a track name of @song.
  // called by Synth, Sampler
  setTrackName(idx: number, name: string) {
    this.song.tracks[idx].name = name;
    this.view.drawTrackName(idx, name, this.song.tracks[idx].type);
  }

  // Set current pattern name of a synth.
  // called by Synth, Sampler
  setPatternName(track_idx: number, name: string) {
    const pat_num = this.current_cells[track_idx];

    if (this.song.tracks[track_idx].patterns[pat_num]) {
      this.song.tracks[track_idx].patterns[pat_num]!.name = name;
    } else {
      this.song.tracks[track_idx].patterns[pat_num] = { name, pattern: [] };
    }

    this.view.drawPatternName(
      track_idx,
      pat_num,
      this.song.tracks[track_idx].patterns[pat_num]!
    );
  }

  // called by Player.
  changeInstrument(id: number, type: InstrumentType, inst: any) {
    const pat_name = id + '-' + this.scene_pos;
    inst.setPatternName(pat_name);

    const patterns: (PatternObject | undefined)[] = [];
    patterns[this.scene_pos] = { name: pat_name, pattern: inst.pattern };

    const s_params: Track = {
      id,
      type,
      name: type === 'REZ' ? 'Synth #' + id : 'Sampler #' + id,
      patterns,
      gain: 1.0,
      pan: 0.0,
    };
    this.song.tracks[id] = s_params;
    inst.setPattern(patterns[this.scene_pos]);

    // Swap patterns[0] and current patterns.
    [
      this.song.tracks[id].patterns[0],
      this.song.tracks[id].patterns[this.current_cells[id]],
    ] = [
      this.song.tracks[id].patterns[this.current_cells[id]],
      this.song.tracks[id].patterns[0],
    ];

    this.view.addInstrument([id, this.scene_pos]);
  }

  empty() {
    this.next_pattern_pos = [];
    this.scenes = [];
    this.scene_pos = 0;
    this.scene = {};
    this.scene_length = 32;

    this.current_cells = [];
    this.next_pattern_pos = [];
    this.next_scene_pos = undefined;

    this.is_loop = true;
    this.is_waiting_next_pattern = false;
    this.is_waiting_next_scene = false;

    this.cue_queue = [];

    this.song = { tracks: [], master: [], length: 0, mixer: null };
  }

  deleteCell() {
    const p = this.view.getSelectPos();
    if (!p) {
      return;
    }
    if (p.type === 'tracks') {
      this.song.tracks[p.x].patterns[p.y] = undefined;
      if (this.current_cells[p.x] === p.y) {
        this.player.instruments[p.x].clearPattern();
        this.current_cells[p.x] = undefined;
      }
      this.view.loadSong(this.current_cells);
    } else if (p.type === 'master') {
      // clear bpm, key, scale (except name)
      this.song.master[p.y] = {
        ...DEFAULT_SCENE,
        name: this.song.master[p.y].name,
      };
      this.view.loadSong(this.current_cells);
    }
  }
}

export { Session };
