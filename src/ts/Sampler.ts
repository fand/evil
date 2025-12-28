/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import Panner from './Panner';
import SamplerCore from './Sampler/Core';
import SamplerView from './Sampler/View';
import SAMPLES from './Sampler/Constant';
import $ from 'jquery';

class Sampler {
  ctx: AudioContext;
  id: number;
  player: any;
  name: string;
  type: string;
  pattern_name: string;
  pattern: any[];
  pattern_obj: { name: string; pattern: any[] };
  time: number;
  view: SamplerView;
  core: SamplerCore;
  is_sustaining: boolean;
  session: any;
  send: GainNode;
  return: GainNode;
  effects: any[];

  constructor(ctx: AudioContext, id: number, player: any, name: string) {
    this.ctx = ctx;
    this.id = id;
    this.player = player;
    this.name = name;
    this.type = 'SAMPLER';
    if (this.name == null) {
      this.name = 'Sampler #' + this.id;
    }

    this.pattern_name = 'pattern 0';
    this.pattern = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    this.pattern_obj = { name: this.pattern_name, pattern: this.pattern };

    this.time = 0;
    this.view = new SamplerView(this, this.id);
    this.core = new SamplerCore(this, this.ctx, this.id);

    this.is_sustaining = false;
    this.session = this.player.session;

    this.send = this.ctx.createGain();
    this.send.gain.value = 1.0;
    this.return = this.ctx.createGain();
    this.return.gain.value = 1.0;
    this.core.connect(this.send);
    this.send.connect(this.return);

    this.effects = [];
  }

  connect(dst) {
    if (dst instanceof Panner) {
      return this.return.connect(dst.in);
    } else {
      return this.return.connect(dst);
    }
  }

  disconnect() {
    return this.return.disconnect();
  }

  setDuration() {}
  setKey() {}
  setScale() {}
  setNote(note: number) {
    return (this.core as any).setNote(note);
  }

  setGain(gain) {
    return this.core.setGain(gain);
  }
  getGain() {
    return this.core.gain;
  }

  noteOn(note) {
    return this.core.noteOn([[note, 1.0]]);
  }

  noteOff() {
    return this.core.noteOff();
  }

  playAt(time) {
    this.time = time;
    const mytime = this.time % this.pattern.length;
    this.view.playAt(mytime);
    if (this.pattern[mytime] !== 0) {
      const notes = this.pattern[mytime];
      return this.core.noteOn(notes);
    }
  }

  play() {
    return this.view.play();
  }

  stop() {
    this.core.noteOff();
    return this.view.stop();
  }

  pause(time) {
    return this.core.noteOff();
  }

  setPattern(_pattern_obj) {
    this.pattern_obj = $.extend(true, {}, _pattern_obj);
    this.pattern = this.pattern_obj.pattern;
    this.pattern_name = this.pattern_obj.name;
    return this.view.setPattern(this.pattern_obj);
  }

  getPattern() {
    this.pattern_obj = { name: this.pattern_name, pattern: this.pattern };
    return $.extend(true, {}, this.pattern_obj);
  }

  clearPattern() {
    this.pattern = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    this.pattern_obj.pattern = this.pattern;
    return this.view.setPattern(this.pattern_obj);
  }

  plusPattern() {
    this.pattern = this.pattern.concat([
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);
    return this.player.resetSceneLength();
  }

  minusPattern() {
    this.pattern = this.pattern.slice(0, this.pattern.length - 32);
    return this.player.resetSceneLength();
  }

  addNote(time, note, gain) {
    if (!Array.isArray(this.pattern[time])) {
      this.pattern[time] = [[this.pattern[time], 1.0]];
    }

    for (
      let i = 0, end = this.pattern[time].length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (this.pattern[time][i][0] === note) {
        this.pattern[time].splice(i, 1);
      }
    }

    return this.pattern[time].push([note, gain]);
  }

  removeNote(pos) {
    return (() => {
      const result = [];
      for (
        let i = 0, end = this.pattern[pos.x_abs].length, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          result.push(this.pattern[pos.x_abs].splice(i, 1));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  activate(i) {
    return this.view.activate(i);
  }
  inactivate(_i?: number) {
    return this.view.inactivate();
  }

  redraw(time) {
    this.time = time;
    return this.view.drawPattern(this.time);
  }

  setSynthName(name) {
    this.name = name;
    this.session.setSynthName(this.id, this.name);
    return this.view.setSynthName(this.name);
  }

  // called by SamplerView.
  inputPatternName(pattern_name) {
    this.pattern_name = pattern_name;
    return this.session.setPatternName(this.id, this.pattern_name);
  }

  setPatternName(pattern_name) {
    this.pattern_name = pattern_name;
    return this.view.setPatternName(this.pattern_name);
  }

  selectSample(sample_now) {
    return this.core.bindSample(sample_now);
  }

  changeSynth(type) {
    var s_new = this.player.changeSynth(this.id, type, s_new);
    this.view.dom.replaceWith(s_new.view.dom);
    this.noteOff();
    return this.disconnect();
  }

  getParam() {
    const p: any = this.core.getParam();
    p.name = this.name;
    p.effects = this.getEffectsParam();
    return p;
  }

  setParam(p) {
    if (p != null) {
      return this.core.setParam(p);
    }
  }

  mute() {
    return this.core.mute();
  }
  demute() {
    return this.core.demute();
  }

  getEffectsParam() {
    return Array.from(this.effects).map((f) => f.getParam());
  }

  insertEffect(fx) {
    if (this.effects.length === 0) {
      this.send.disconnect();
      this.send.connect(fx.in);
    } else {
      this.effects[this.effects.length - 1].disconnect();
      this.effects[this.effects.length - 1].connect(fx.in);
    }

    fx.connect(this.return);
    fx.setSource(this);
    return this.effects.push(fx);
  }

  removeEffect(fx) {
    let prev;
    const i = this.effects.indexOf(fx);
    if (i === -1) {
      return;
    }

    if (i === 0) {
      prev = this.send;
    } else {
      prev = this.effects[i - 1];
    }

    prev.disconnect();
    if (this.effects[i + 1] != null) {
      prev.connect(this.effects[i + 1].in);
    } else {
      prev.connect(this.return);
    }

    fx.disconnect();
    return this.effects.splice(i, 1);
  }
}

// Export!
export default Sampler;
