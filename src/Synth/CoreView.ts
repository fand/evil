import $ from 'jquery';
import type { SynthCore } from './SynthCore';

export class SynthCoreView {
  model: SynthCore;
  id: number;
  dom: JQuery;
  vcos: JQuery;
  EG_inputs: JQuery;
  FEG_inputs: JQuery;
  filter_inputs: JQuery;
  gain_inputs: JQuery;
  canvasEG: HTMLCanvasElement;
  canvasFEG: HTMLCanvasElement;
  contextEG: CanvasRenderingContext2D;
  contextFEG: CanvasRenderingContext2D;

  constructor(model: SynthCore, id: number, dom: JQuery) {
    this.model = model;
    this.id = id;
    this.dom = dom;
    this.vcos = $(this.dom.find('.RS_VCO'));

    this.EG_inputs = this.dom.find('.RS_EG input');
    this.FEG_inputs = this.dom.find('.RS_FEG input');
    this.filter_inputs = this.dom.find('.RS_filter input');
    this.gain_inputs = this.dom.find('.RS_mixer input');

    this.canvasEG = this.dom
      .find('.RS_EG .canvasEG')
      .get()[0] as HTMLCanvasElement;
    this.canvasFEG = this.dom
      .find('.RS_FEG .canvasFEG')
      .get()[0] as HTMLCanvasElement;
    this.contextEG = this.canvasEG.getContext('2d')!;
    this.contextFEG = this.canvasFEG.getContext('2d')!;

    this.initEvent();
  }

  initEvent() {
    this.vcos.on('change', () => this.fetchVCOParam());
    this.gain_inputs.on('change', () => this.fetchGains());
    this.filter_inputs.on('change', () => this.fetchFilterParam());
    this.EG_inputs.on('change', () => this.fetchEGParam());
    this.FEG_inputs.on('change', () => this.fetchFEGParam());
    this.fetchParam();
  }

  updateCanvas(name: string) {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let adsr: number[];
    if (name === 'EG') {
      canvas = this.canvasEG;
      context = this.contextEG;
      adsr = this.model.eg.getADSR();
    } else {
      canvas = this.canvasFEG;
      context = this.contextFEG;
      adsr = this.model.feg.getADSR();
    }

    const w = (canvas.width = 180);
    const h = (canvas.height = 50);
    const w4 = w / 4;
    context.clearRect(0, 0, w, h);
    context.beginPath();
    context.moveTo(w4 * (1.0 - adsr[0]), h);
    context.lineTo(w / 4, 0); // attack
    context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2])); // decay
    context.lineTo(w4 * 3, h * (1.0 - adsr[2])); // sustain
    context.lineTo(w4 * (adsr[3] + 3), h); // release
    context.strokeStyle = 'rgb(0, 220, 255)';
    context.stroke();
  }

  fetchParam() {
    this.fetchVCOParam();
    this.fetchEGParam();
    this.fetchFEGParam();
    this.fetchFilterParam();
    this.fetchGains();
  }

  fetchVCOParam() {
    const harmony = this.vcos.eq(0).find('.harmony').val() as string;

    for (let i = 0; i < this.vcos.length; i++) {
      const vco = this.vcos.eq(i);

      this.model.setVCOParam(
        i,
        vco.find('.shape').val() as string,
        parseInt(vco.find('.octave').val() as string),
        parseInt(vco.find('.interval').val() as string),
        parseInt(vco.find('.fine').val() as string),
        harmony
      );
    }
  }

  setVCOParam(p: any[]) {
    for (let i = 0; i < this.vcos.length; i++) {
      var vco = this.vcos.eq(i);
      vco.find('.shape').val(p[i].shape);
      vco.find('.octave').val(p[i].octave);
      vco.find('.interval').val(p[i].interval);
      vco.find('.fine').val(p[i].fine);
    }
  }

  fetchEGParam() {
    this.model.setEGParam(
      parseFloat(this.EG_inputs.eq(0).val() as string),
      parseFloat(this.EG_inputs.eq(1).val() as string),
      parseFloat(this.EG_inputs.eq(2).val() as string),
      parseFloat(this.EG_inputs.eq(3).val() as string)
    );
    this.updateCanvas('EG');
  }

  setEGParam(p: any) {
    this.EG_inputs.eq(0).val(p.adsr[0] * 50000);
    this.EG_inputs.eq(1).val(p.adsr[1] * 50000);
    this.EG_inputs.eq(2).val(p.adsr[2] * 100);
    this.EG_inputs.eq(3).val(p.adsr[3] * 50000);
  }

  fetchFEGParam() {
    this.model.setFEGParam(
      parseFloat(this.FEG_inputs.eq(0).val() as string),
      parseFloat(this.FEG_inputs.eq(1).val() as string),
      parseFloat(this.FEG_inputs.eq(2).val() as string),
      parseFloat(this.FEG_inputs.eq(3).val() as string)
    );
    this.updateCanvas('FEG');
  }

  setFEGParam(p: any) {
    for (let i = 0; i < p.length; i++) {
      this.FEG_inputs.eq(i).val(p.adsr[i]);
    }
  }

  fetchFilterParam() {
    this.model.setFilterParam(
      parseFloat(this.filter_inputs.eq(0).val() as string),
      parseFloat(this.filter_inputs.eq(1).val() as string)
    );
  }

  setFilterParam(p: any) {
    this.filter_inputs.eq(0).val(p[0]);
    this.filter_inputs.eq(1).val(p[1]);
  }

  fetchGains() {
    for (let i = 0; i < this.gain_inputs.length; i++) {
      this.model.setVCOGain(
        i,
        parseInt(this.gain_inputs.eq(i).val() as string)
      );
    }
  }

  setParam(p: any) {
    if (p.vcos !== undefined) {
      this.setVCOParam(p.vcos);
    }
    if (p.gains !== undefined) {
      for (let i = 0; i < p.gains.length; i++) {
        this.gain_inputs.eq(i).val((p.gains[i] / 0.3) * 100);
      }
    }
    if (p.eg !== undefined) {
      this.setEGParam(p.eg);
    }
    if (p.feg !== undefined) {
      this.setFEGParam(p.feg);
    }
    if (p.filter !== undefined) {
      this.setFilterParam(p.filter);
    }
  }
}
