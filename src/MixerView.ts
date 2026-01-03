import type { Mixer } from './Mixer';

export class MixerView {
  model: Mixer;
  dom: HTMLElement;
  tracks: HTMLElement;
  master: HTMLElement;
  console_tracks: HTMLElement;
  console_master: HTMLElement;
  gains: HTMLInputElement[];
  gain_master: HTMLInputElement;
  pans_label: HTMLElement[];
  pans: HTMLInputElement[];
  pan_master: HTMLInputElement;
  canvas_tracks_dom: HTMLCanvasElement[];
  canvas_tracks: HTMLCanvasElement[];
  ctx_tracks: CanvasRenderingContext2D[];
  canvas_master_dom: HTMLCanvasElement;
  canvas_master: HTMLCanvasElement;
  ctx_master: CanvasRenderingContext2D;
  track_dom: HTMLElement;

  constructor(model: Mixer) {
    this.model = model;
    this.dom = document.getElementById('mixer')!;

    this.tracks = document.getElementById('mixer-tracks')!;
    this.master = document.getElementById('mixer-master')!;
    this.console_tracks = this.tracks.querySelector('#console-tracks')!;
    this.console_master = this.master.querySelector('#console-master')!;

    this.gains = Array.from(
      this.tracks.querySelectorAll<HTMLInputElement>(
        '.console-track > .gain-slider'
      )
    );
    this.gain_master = this.master.querySelector<HTMLInputElement>(
      '.console-track > .gain-slider'
    )!;

    this.pans_label = Array.from(
      this.tracks.querySelectorAll<HTMLElement>('.console-track > .pan-label')
    );
    this.pans = Array.from(
      this.tracks.querySelectorAll<HTMLInputElement>(
        '.console-track > .pan-slider'
      )
    );
    this.pan_master = this.master.querySelector<HTMLInputElement>(
      '.console-track > .pan-slider'
    )!;

    this.canvas_tracks_dom = Array.from(
      this.tracks.querySelectorAll<HTMLCanvasElement>('.vu-meter')
    );
    this.canvas_tracks = this.canvas_tracks_dom;

    this.ctx_tracks = [];
    for (const c of this.canvas_tracks) {
      const ctx = c.getContext('2d')!; // TODO: consider context count limit
      this.ctx_tracks.push(ctx);
    }

    for (const c of this.canvas_tracks) {
      [c.width, c.height] = [10, 100];
    }

    this.canvas_master_dom = this.master.querySelector<HTMLCanvasElement>(
      '.vu-meter'
    )!;
    this.canvas_master = this.canvas_master_dom;
    this.ctx_master = this.canvas_master.getContext('2d')!;
    this.canvas_master.width = 70;
    this.canvas_master.height = 130;
    this.ctx_master.fillStyle = '#fff';
    this.ctx_master.fillRect(10, 0, 50, 130);

    this.track_dom = document.querySelector('#templates > .console-track')!;
    this.initEvent();
  }

  initEvent() {
    this.console_tracks.addEventListener('change', () => this.setParams());
    this.console_master.addEventListener('change', () => this.setParams());
  }

  drawGainTracks(i: number, data: Uint8Array) {
    const v = Math.max.apply(null, Array.from(data));
    const h = ((v - 128) / 128) * 100;

    this.ctx_tracks[i].clearRect(0, 0, 10, 100);
    this.ctx_tracks[i].fillStyle = '#0df';
    return this.ctx_tracks[i].fillRect(0, 100 - h, 10, h);
  }

  drawGainMaster(data_l: Uint8Array, data_r: Uint8Array) {
    const v_l = Math.max.apply(null, Array.from(data_l));
    const v_r = Math.max.apply(null, Array.from(data_r));
    const h_l = ((v_l - 128) / 128) * 130;
    const h_r = ((v_r - 128) / 128) * 130;

    this.ctx_master.clearRect(0, 0, 10, 130);
    this.ctx_master.clearRect(60, 0, 10, 130);
    this.ctx_master.fillStyle = '#0df';
    this.ctx_master.fillRect(0, 130 - h_l, 10, h_l);
    return this.ctx_master.fillRect(60, 130 - h_r, 10, h_r);
  }

  addInstrument() {
    const dom = this.track_dom.cloneNode(true) as HTMLElement;
    this.console_tracks.appendChild(dom);
    this.pans.push(dom.querySelector<HTMLInputElement>('.pan-slider')!);
    this.gains.push(dom.querySelector<HTMLInputElement>('.gain-slider')!);
    this.pans_label.push(dom.querySelector<HTMLElement>('.pan-label')!);

    const canvas = dom.querySelector<HTMLCanvasElement>('.vu-meter')!;
    this.canvas_tracks_dom.push(canvas);
    this.canvas_tracks.push(canvas);
    this.ctx_tracks.push(canvas.getContext('2d')!);
    [canvas.width, canvas.height] = [10, 100];

    this.console_tracks.style.width = this.gains.length * 80 + 2 + 'px';
    this.console_tracks.addEventListener('change', () => this.setGains());

    return this.setParams();
  }

  setGains() {
    const g = this.gains.map((_g) => parseFloat(_g.value) / 100.0);
    const g_master = parseFloat(this.gain_master.value) / 100.0;
    return this.model.setGains(g, g_master);
  }

  setPans() {
    const pans = this.pans.map((p) => 1.0 - parseFloat(p.value) / 200.0);
    const p_master = 1.0 - parseFloat(this.pan_master.value) / 200.0;
    this.model.setPans(pans, p_master);

    for (let i = 0, end = this.pans.length; i < end; i++) {
      const l = parseInt(this.pans[i].value) - 100;
      const t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';
      this.pans_label[i].textContent = t;
    }
  }

  loadGains(g: number[], g_master: number) {
    for (let i = 0; i < g.length; i++) {
      this.gains[i].value = String(g[i] * 100.0);
    }
    this.gain_master.value = String(g_master * 100.0);
  }

  loadPans(p: number[], pan_master: number) {
    for (let i = 0, end = p.length; i < end; i++) {
      this.pans[i].value = String((1.0 - p[i]) * 200);

      const l = (p[i] * 200 - 100) * -1;
      const t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';

      this.pans_label[i].textContent = t;
    }

    const l = (pan_master * 200 - 100) * -1;
    const t = l === 0 ? 'C' : l < 0 ? -l + '% L' : l + '% R';
    this.pan_master.textContent = t;
  }

  setParams() {
    this.setGains();
    this.setPans();
  }

  displayGains() {}

  pan2pos(v: number) {
    const theta = v * Math.PI;
    return [Math.cos(theta), 0, -Math.sin(theta)];
  }

  pos2pan(v: number[]) {
    return Math.acos(v[0]) / Math.PI;
  }

  empty() {
    this.console_tracks.replaceChildren();
    this.canvas_tracks_dom = [];
    this.canvas_tracks = [];
    this.ctx_tracks = [];
    this.pans = [];
    this.gains = [];
    this.pans_label = [];
  }
}
