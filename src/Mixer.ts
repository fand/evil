/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { MixerView } from './MixerView';
import { Panner } from './Panner';
import { Limiter } from './FX/Limiter';
import { Fuzz } from './FX/Fuzz';
import { Delay } from './FX/Delay';
import { Double } from './FX/Double';
import { Reverb } from './FX/Reverb';
import { Compressor } from './FX/Compressor';
import { FX } from './FX/FX';
import type { Sampler } from './Sampler';
import type { Synth } from './Synth';
import type { Player } from './Player';

export class Mixer {
  ctx: AudioContext;
  player: Player;
  gain_master: number;
  gain_tracks: number[];
  out: GainNode;
  send: GainNode;
  return: GainNode;
  panners: Panner[];
  analysers: AnalyserNode[];
  splitter_master: ChannelSplitterNode;
  analyser_master: AnalyserNode[];
  limiter: Limiter;
  effects_master: FX[];
  view: MixerView;
  pan_tracks: number[];
  pan_master: number;

  constructor(ctx: AudioContext, player: Player) {
    this.addMasterEffect = this.addMasterEffect.bind(this);
    this.ctx = ctx;
    this.player = player;
    this.gain_master = 1.0;
    this.gain_tracks = this.player.synth.map((s) => s.getGain());

    this.out = this.ctx.createGain();
    this.out.gain.value = this.gain_master;

    this.send = this.ctx.createGain();
    this.send.gain.value = 1.0;

    this.return = this.ctx.createGain();
    this.return.gain.value = 1.0;

    this.panners = [];
    this.analysers = [];

    // Master VU meter
    this.splitter_master = this.ctx.createChannelSplitter(2);
    this.analyser_master = [
      this.ctx.createAnalyser(),
      this.ctx.createAnalyser(),
    ];
    this.out.connect(this.splitter_master);
    for (var i of [0, 1]) {
      this.splitter_master.connect(this.analyser_master[i], i);
      this.analyser_master[i].fftSize = 1024;
      this.analyser_master[i].minDecibels = -100.0;
      this.analyser_master[i].maxDecibels = 0.0;
      this.analyser_master[i].smoothingTimeConstant = 0.0;
    }

    // Master Effects
    this.limiter = new Limiter(this.ctx);

    this.send.connect(this.return);
    this.return.connect(this.limiter.in);
    this.limiter.connect(this.out);

    this.effects_master = [];

    this.out.connect(this.ctx.destination);

    this.view = new MixerView(this);

    setInterval(() => {
      return this.drawGains();
    }, 30);
  }

  drawGains() {
    // Tracks
    for (
      let i = 0, end = this.analysers.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      var data = new Uint8Array(this.analysers[i].frequencyBinCount);
      this.analysers[i].getByteTimeDomainData(data);
      this.view.drawGainTracks(i, data);
    }

    // Master
    const data_l = new Uint8Array(this.analyser_master[0].frequencyBinCount);
    const data_r = new Uint8Array(this.analyser_master[1].frequencyBinCount);
    this.analyser_master[0].getByteTimeDomainData(data_l);
    this.analyser_master[1].getByteTimeDomainData(data_r);
    return this.view.drawGainMaster(data_l, data_r);
  }

  empty() {
    this.gain_tracks = [];
    this.panners = [];
    this.analysers = [];
    return this.view.empty();
  }

  addSynth(synth: Synth | Sampler) {
    // Create new panner
    const p = new Panner(this.ctx);
    synth.connect(p.in);
    p.connect(this.send);
    this.panners.push(p);

    const a = this.ctx.createAnalyser();
    synth.connect(a);
    this.analysers.push(a);

    return this.view.addSynth(synth);
  }

  setGains(gain_tracks: number[], gain_master: number) {
    this.gain_tracks = gain_tracks;
    this.gain_master = gain_master;
    for (
      let i = 0, end = this.gain_tracks.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.player.synth[i].setGain(this.gain_tracks[i]);
    }
    return (this.out.gain.value = this.gain_master);
  }

  setPans(pan_tracks: number[], pan_master: number) {
    this.pan_tracks = pan_tracks;
    this.pan_master = pan_master;
    for (let i = 0; i < this.pan_tracks.length; i++) {
      this.panners[i].setPosition(this.pan_tracks[i]);
    }
  }

  readGains(gain_tracks: number[], gain_master: number) {
    this.gain_tracks = gain_tracks;
    this.gain_master = gain_master;
    this.setGains(this.gain_tracks, this.gain_master);
    return this.view.readGains(this.gain_tracks, this.gain_master);
  }

  readPans(pan_tracks: number[], pan_master: number) {
    this.pan_tracks = pan_tracks;
    this.pan_master = pan_master;
    this.setPans(this.pan_tracks, this.pan_master);
    this.view.readPans(this.pan_tracks, this.pan_master);
  }

  getParam() {
    return {
      gain_tracks: this.gain_tracks,
      gain_master: this.gain_master,
      pan_tracks: this.pan_tracks,
      pan_master: this.pan_master,
    };
  }

  readParam(
    p: {
      gain_tracks: number[];
      gain_master: number;
      pan_tracks: number[];
      pan_master: number;
    } | null
  ) {
    if (p == null) {
      return;
    }
    this.readGains(p.gain_tracks, p.gain_master);
    this.readPans(p.pan_tracks, p.pan_master);
  }

  changeSynth(idx: number, synth: Synth | Sampler) {
    synth.connect(this.panners[idx].in);
    return synth.connect(this.analysers[idx]);
  }

  addMasterEffect(name: string) {
    let fx: FX;
    if (name === 'Fuzz') {
      fx = new Fuzz(this.ctx);
    } else if (name === 'Delay') {
      fx = new Delay(this.ctx);
    } else if (name === 'Reverb') {
      fx = new Reverb(this.ctx);
    } else if (name === 'Comp') {
      fx = new Compressor(this.ctx);
    } else if (name === 'Double') {
      fx = new Double(this.ctx);
    } else {
      throw new TypeError(`Invalid FX type: ${name}`);
    }

    const pos = this.effects_master.length;
    if (pos === 0) {
      this.send.disconnect();
      this.send.connect(fx.in);
    } else {
      this.effects_master[pos - 1].disconnect();
      this.effects_master[pos - 1].connect(fx.in);
    }

    fx.connect(this.return);
    fx.setSource(this);
    this.effects_master.push(fx);

    return fx;
  }

  addTracksEffect(x: number, name: string) {
    let fx: FX;
    if (name === 'Fuzz') {
      fx = new Fuzz(this.ctx);
    } else if (name === 'Delay') {
      fx = new Delay(this.ctx);
    } else if (name === 'Reverb') {
      fx = new Reverb(this.ctx);
    } else if (name === 'Comp') {
      fx = new Compressor(this.ctx);
    } else if (name === 'Double') {
      fx = new Double(this.ctx);
    } else {
      throw new TypeError(`Invalid effect type: ${name}`);
    }

    this.player.synth[x].insertEffect(fx);
    return fx;
  }

  removeEffect(fx: FX) {
    let prev;
    const i = this.effects_master.indexOf(fx);
    if (i === -1) {
      return;
    }

    if (i === 0) {
      prev = this.send;
    } else {
      prev = this.effects_master[i - 1];
    }

    prev.disconnect();
    if (this.effects_master[i + 1] != null) {
      prev.connect(this.effects_master[i + 1].in);
    } else {
      prev.connect(this.return);
    }
    fx.disconnect();

    return this.effects_master.splice(i, 1);
  }
}
