/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';

export class MixerView {
  model: any;
  dom: JQuery;
  tracks: JQuery;
  master: JQuery;
  console_tracks: JQuery;
  console_master: JQuery;
  gains: JQuery[];
  gain_master: JQuery;
  pans_label: JQuery[];
  pans: JQuery[];
  pan_master: JQuery;
  canvas_tracks_dom: JQuery[];
  canvas_tracks: HTMLCanvasElement[];
  ctx_tracks: CanvasRenderingContext2D[];
  canvas_master_dom: JQuery;
  canvas_master: HTMLCanvasElement;
  ctx_master: CanvasRenderingContext2D;
  track_dom: JQuery;

  constructor(model: any) {
    let c;
    this.model = model;
    this.dom = $('#mixer');

    this.tracks = $('#mixer-tracks');
    this.master = $('#mixer-master');
    this.console_tracks = this.tracks.find('#console-tracks');
    this.console_master = this.master.find('#console-master');

    this.gains = Array.from(
      this.tracks.find('.console-track > .gain-slider')
    ) as unknown as JQuery[];
    this.gain_master = this.master.find('.console-track > .gain-slider');

    this.pans_label = Array.from(
      this.tracks.find('.console-track > .pan-label')
    ) as unknown as JQuery[];
    this.pans = Array.from(
      this.tracks.find('.console-track > .pan-slider')
    ) as unknown as JQuery[];
    this.pan_master = this.master.find('.console-track > .pan-slider');

    this.canvas_tracks_dom = Array.from(
      this.tracks.find('.vu-meter')
    ) as unknown as JQuery[];
    this.canvas_tracks = this.canvas_tracks_dom.map(
      (d) => d[0] as HTMLCanvasElement
    );

    this.ctx_tracks = [];
    for (const c of this.canvas_tracks) {
      const ctx = c.getContext('2d')!; // TODO: consider context count limit
      this.ctx_tracks.push(ctx);
    }

    for (const c of this.canvas_tracks) {
      [c.width, c.height] = [10, 100];
    }

    this.canvas_master_dom = this.master.find('.vu-meter');
    this.canvas_master = this.canvas_master_dom[0] as HTMLCanvasElement;
    this.ctx_master = this.canvas_master.getContext('2d')!;
    this.canvas_master.width = 70;
    this.canvas_master.height = 130;
    this.ctx_master.fillStyle = '#fff';
    this.ctx_master.fillRect(10, 0, 50, 130);

    this.track_dom = $('#templates > .console-track');
    this.initEvent();
  }

  initEvent() {
    this.console_tracks.on('change', () => this.setParams());
    return this.console_master.on('change', () => this.setParams());
  }

  drawGainTracks(i: number, data: Uint8Array) {
    const v = Math.max.apply(null, data);
    const h = ((v - 128) / 128) * 100;

    this.ctx_tracks[i].clearRect(0, 0, 10, 100);
    this.ctx_tracks[i].fillStyle = '#0df';
    return this.ctx_tracks[i].fillRect(0, 100 - h, 10, h);
  }

  drawGainMaster(data_l: Uint8Array, data_r: Uint8Array) {
    const v_l = Math.max.apply(null, data_l);
    const v_r = Math.max.apply(null, data_r);
    const h_l = ((v_l - 128) / 128) * 130;
    const h_r = ((v_r - 128) / 128) * 130;

    this.ctx_master.clearRect(0, 0, 10, 130);
    this.ctx_master.clearRect(60, 0, 10, 130);
    this.ctx_master.fillStyle = '#0df';
    this.ctx_master.fillRect(0, 130 - h_l, 10, h_l);
    return this.ctx_master.fillRect(60, 130 - h_r, 10, h_r);
  }

  addSynth(synth: any) {
    const dom = this.track_dom.clone();
    this.console_tracks.append(dom);
    this.pans.push(dom.find('.pan-slider'));
    this.gains.push(dom.find('.gain-slider'));
    this.pans_label.push(dom.find('.pan-label'));

    const d = dom.find('.vu-meter');
    this.canvas_tracks_dom.push(d as any);
    const canvas = d[0] as HTMLCanvasElement;
    this.canvas_tracks.push(canvas);
    this.ctx_tracks.push(canvas.getContext('2d')!);
    [canvas.width, canvas.height] = Array.from([10, 100]);

    this.console_tracks.css({ width: this.gains.length * 80 + 2 + 'px' });
    this.console_tracks.on('change', () => this.setGains());

    return this.setParams();
  }

  setGains() {
    const g = Array.from(this.gains).map(
      (_g) => parseFloat((_g as any).val() as string) / 100.0
    );
    const g_master = parseFloat(this.gain_master.val() as string) / 100.0;
    return this.model.setGains(g, g_master);
  }

  setPans() {
    const pans = this.pans.map(
      (p) => 1.0 - parseFloat((p as any).val() as string) / 200.0
    );
    const p_master = 1.0 - parseFloat(this.pan_master.val() as string) / 200.0;
    this.model.setPans(pans, p_master);

    for (let i = 0, end = this.pans.length; i < end; i++) {
      var l = parseInt((this.pans[i] as any).val() as string) - 100;
      var t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';
      this.pans_label[i].text(t);
    }
  }

  readGains(g: number[], g_master: number) {
    for (
      let i = 0, end = g.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.gains[i].val(g[i] * 100.0);
    }
    return this.gain_master.val(g_master * 100.0);
  }

  readPans(p: number[], pan_master: number) {
    for (let i = 0, end = p.length; i < end; i++) {
      this.pans[i].val((1.0 - p[i]) * 200);

      const l = (p[i] * 200 - 100) * -1;
      const t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';

      this.pans_label[i].text(t);
    }

    const l = (pan_master * 200 - 100) * -1;
    const t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';
    this.pan_master.text(t);
  }

  setParams() {
    this.setGains();
    this.setPans();
  }

  displayGains(gains: number[]) {}

  pan2pos(v: number) {
    const theta = v * Math.PI;
    return [Math.cos(theta), 0, -Math.sin(theta)];
  }

  pos2pan(v: number[]) {
    return Math.acos(v[0]) / Math.PI;
  }

  empty() {
    this.console_tracks.empty();
    this.canvas_tracks_dom = [];
    this.canvas_tracks = [];
    this.ctx_tracks = [];
    this.pans = [];
    this.gains = [];
    return (this.pans_label = []);
  }
}
