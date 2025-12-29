/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import SessionView from './SessionView';
import Song from './Song';
import $ from 'jquery';

// Control the patterns for tracks.
class Session {
  ctx: AudioContext;
  player: any;
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
  song: any;
  view: SessionView;
  synth: any[];

  constructor(ctx: AudioContext, player: any) {
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

    this.song = Song.DEFAULT;

    this.view = new SessionView(this, this.song);
  }

  toggleLoop() {
    return (this.is_loop = !this.is_loop);
  }

  // Read patterns for the next measure.
  nextMeasure(synth: any, _time?: number) {
    this.synth = synth;
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
    for (var q of Array.from(this.cue_queue)) {
      var pat = this.song.tracks[q[0]].patterns[q[1]];
      this.synth[q[0]].setPattern(pat);
      this.current_cells[q[0]] = q[1];
    }
    this.view.drawScene(this.scene_pos, this.current_cells);
    this.next_pattern_pos = [];
    return (this.cue_queue = []);
  }

  // Read patterns for the next scene.
  nextScene(pos?: number) {
    this.savePatterns();

    this.is_waiting_next_scene = false;
    if (pos == null) {
      this.scene_pos++;
      pos = this.scene_pos;
    } else {
      this.scene_pos = pos;
    }

    if (this.scene_pos >= this.song.length) {
      this.player.is_playing = false;
      this.view.clearAllActive();
      this.scene_pos = this.next_scene_pos = 0;
      this.current_cells = Array.from(this.song.tracks).map((s) => 0);
      return;
    }

    for (
      let i = 0, end = this.synth.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (this.song.tracks[i].patterns[this.scene_pos] == null) {
        continue;
      }
      var pat = this.song.tracks[i].patterns[this.scene_pos];
      if (pat != null && pat !== null) {
        this.synth[i].setPattern(pat);
        this.scene_length = Math.max(this.scene_length, pat.pattern.length);
        this.current_cells[i] = pos;
      }
    }

    if (this.song.master[this.scene_pos] != null) {
      this.player.readScene(this.song.master[this.scene_pos]);
    }
    this.player.setSceneLength(this.scene_length);
    this.view.readSong(this.song, this.current_cells);
    this.view.drawScene(this.scene_pos, this.current_cells);
    this.next_pattern_pos = [];
    this.next_scene_pos = undefined;
    return (this.cue_queue = []);
  }

  getScene(i) {
    return this.song.master[i];
  }

  // Display current states via SessionView.
  play() {
    return this.view.drawScene(this.scene_pos, this.current_cells);
  }

  beat() {
    if (this.is_waiting_next_scene) {
      return this.view.beat(true, [0, this.next_scene_pos]);
    } else {
      return this.view.beat(false, this.cue_queue);
    }
  }

  // Cue patterns to play next.
  cuePattern(synth_num, pat_num) {
    this.is_waiting_next_pattern = true;
    this.next_pattern_pos[synth_num] = pat_num;
    return this.cue_queue.push([synth_num, pat_num]);
  }

  cueScene(scene_num) {
    this.is_waiting_next_scene = true;
    return (this.next_scene_pos = scene_num);
  }

  next() {
    this.nextScene();
    return this.nextPattern();
  }

  addSynth(s, _pos) {
    const pos = _pos ? _pos : this.scene_pos;

    const name = s.id + '-' + pos;
    s.setPatternName(name);

    const patterns = [];
    patterns[pos] = { name: s.pattern_name, pattern: s.pattern };
    const s_obj = {
      id: s.id,
      type: s.type,
      name: s.name,
      patterns,
      params: [],
      gain: 1.0,
      pan: 0.0,
    };

    this.song.tracks.push(s_obj);
    this.current_cells.push(pos);

    return this.view.addSynth(this.song);
  }

  setSynth(synth) {
    this.synth = synth;
  }

  // Read given song, called by Player.
  readTrack(song, src, dst) {
    // add master
    this.song = song;
    if (this.song.master[dst.y] == null) {
      this.song.master[dst.y] = { name: 'section-' + dst.y };
    }
    if (dst.y + 1 > this.song.length) {
      this.song.length = dst.y + 1;
    }

    const { name } = this.song.tracks[src.x].patterns[src.y];

    // add track pattern
    let synth_num = dst.x;
    if (this.song.tracks.length <= dst.x) {
      synth_num = this.song.tracks.length;

      if (this.song.tracks[src.x].type === 'REZ') {
        this.player.addSynth(dst.y);
      } else if (this.song.tracks[src.x].type === 'SAMPLER') {
        this.player.addSampler(dst.y);
      }
    }

    return this.song.tracks.length - 1;
  }

  readPattern(pat, synth_num, pat_num) {
    this.song.tracks[synth_num].patterns[pat_num] = pat;
    if (this.song.master[pat_num] == null) {
      this.song.master[pat_num] = { name: 'section-' + pat_num };
    }
    if (pat_num + 1 > this.song.length) {
      this.song.length = pat_num + 1;
    }
    if (this.current_cells[synth_num] === pat_num) {
      return this.player.synth[synth_num].setPattern(pat);
    }
  }

  readMaster(pat, pat_num) {
    this.song.master[pat_num] = pat;
    if (pat_num + 1 > this.song.length) {
      return (this.song.length = pat_num + 1);
    }
  }

  editPattern(_synth_num, pat_num) {
    // add master
    if (this.song.master[pat_num] == null) {
      this.song.master[pat_num] = { name: 'section-' + pat_num };
    }
    if (pat_num + 1 > this.song.length) {
      this.song.length = pat_num + 1;
    }

    // add track pattern
    let synth_num = _synth_num;
    if (this.song.tracks.length <= _synth_num) {
      synth_num = this.song.tracks.length;
      this.player.addSynth(pat_num);
    }

    // Save old pattern (for old @current_cells)
    this.savePattern(synth_num, this.current_cells[synth_num]);

    if (this.song.tracks[synth_num].patterns[pat_num] != null) {
      this.player.synth[synth_num].setPattern(
        this.song.tracks[synth_num].patterns[pat_num]
      );
    } else {
      // set new pattern
      const pat_name = synth_num + '-' + pat_num;
      this.player.synth[synth_num].clearPattern();
      this.player.synth[synth_num].setPatternName(pat_name);
      this.song.tracks[synth_num].patterns[pat_num] =
        this.player.synth[synth_num].getPattern();
    }

    // draw
    this.current_cells[synth_num] = pat_num;
    this.view.readSong(this.song, this.current_cells);
    this.player.moveTo(synth_num);

    return [synth_num, pat_num, this.song.tracks[synth_num].patterns[pat_num]];
  }

  // Save patterns into @song.
  savePatterns() {
    return __range__(0, this.current_cells.length, false).map((i) =>
      this.savePattern(i, this.current_cells[i])
    );
  }

  savePattern(x, y) {
    return (this.song.tracks[x].patterns[y] =
      this.player.synth[x].getPattern());
  }

  // Save parameters for tracks into @song.
  saveTracks() {
    return (() => {
      const result = [];
      for (
        let i = 0, end = this.player.synth.length, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        var param = this.player.synth[i].getParam();
        if (this.song.tracks[i].patterns != null) {
          param.patterns = this.song.tracks[i].patterns;
        }
        result.push((this.song.tracks[i] = param));
      }
      return result;
    })();
  }

  saveTracksEffect(pos) {
    return (this.song.tracks[pos.x].effects =
      this.player.synth[pos.x].getEffectsParam());
  }

  // Save master track into @song.
  saveMaster(y, obj) {
    this.song.master[y] = obj;
    this.view.readSong(this.song, this.current_cells);
    if (y === this.scene_pos) {
      return this.player.readScene(obj);
    }
  }

  saveMasters() {
    if (this.song.master.length === 0) {
      return this.song.master.push(this.player.getScene());
    }
  }

  // Save mixer into @song.
  saveMixer() {
    return (this.song.mixer = this.player.mixer.getParam());
  }

  saveSong() {
    // Save patterns and parameters into JSON.
    this.savePatterns();
    this.saveTracks();
    this.saveMasters();
    this.saveMixer();
    const song_json = JSON.stringify(this.song);

    // Save the song via ajax.
    return $.ajax({
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
        return this.view.showSuccess(d, this.song.title, this.song.creator);
      })
      .fail((err) => {
        return this.view.showError(err);
      });
  }

  // Read the song given by Player.
  readSong(song) {
    this.song = song;
    this.scene_pos = 0;
    this.scene_length = 0;
    for (
      let i = 0, end = this.song.tracks.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      var pat = this.song.tracks[i].patterns[0];
      if (pat != null && pat !== null) {
        this.synth[i].setPattern(pat);
        this.current_cells[i] = 0;
        this.scene_length = Math.max(this.scene_length, pat.pattern.length);
      } else {
        this.current_cells[i] = undefined;
      }
    }

    return this.view.readSong(this.song, this.current_cells);
  }

  // Set a track name of @song.
  // called by Synth, Sampler
  setSynthName(synth_id, name) {
    this.song.tracks[synth_id].name = name;
    return this.view.drawTrackName(
      synth_id,
      name,
      this.song.tracks[synth_id].type
    );
  }

  // Set current pattern name of a synth.
  // called by Synth, Sampler
  setPatternName(synth_id, name) {
    const pat_num = this.current_cells[synth_id];

    if (this.song.tracks[synth_id].patterns[pat_num] != null) {
      this.song.tracks[synth_id].patterns[pat_num].name = name;
    } else {
      this.song.tracks[synth_id].patterns[pat_num] = { name };
    }

    return this.view.drawPatternName(
      synth_id,
      pat_num,
      this.song.tracks[synth_id].patterns[pat_num]
    );
  }

  // called by Player.
  changeSynth(id, type, synth_new) {
    const pat_name = id + '-' + this.scene_pos;
    synth_new.setPatternName(pat_name);

    const patterns = [];
    patterns[this.scene_pos] = { name: pat_name, pattern: synth_new.pattern };

    const s_params = {
      id,
      type,
      name: 'Synth #' + id,
      patterns,
      params: [],
      gain: 1.0,
      pan: 0.0,
    };
    this.song.tracks[id] = s_params;
    synth_new.setPattern(patterns[this.scene_pos]);

    // Swap patterns[0] and current patterns.
    [
      this.song.tracks[id].patterns[0],
      this.song.tracks[id].patterns[this.current_cells[id]],
    ] = Array.from([
      this.song.tracks[id].patterns[this.current_cells[id]],
      this.song.tracks[id].patterns[0],
    ]);

    return this.view.addSynth(this.song, [id, this.scene_pos]);
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

    return (this.song = { tracks: [], master: [], length: 0, mixer: [] });
  }

  deleteCell() {
    const p = this.view.getSelectPos();
    if (p == null) {
      return;
    }
    if (p.type === 'tracks') {
      this.song.tracks[p.x].patterns[p.y] = undefined;
      if (this.current_cells[p.x] === p.y) {
        this.player.synth[p.x].clearPattern();
        this.current_cells[p.x] = undefined;
      }
      return this.view.readSong(this.song, this.current_cells);
    } else if (p.type === 'master') {
      // clear bpm, key, scale (except name)
      this.song.master[p.y] = { name: this.song.master[p.y].name };
      return this.view.readSong(this.song, this.current_cells);
    }
  }
}

// Export!
export default Session;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
