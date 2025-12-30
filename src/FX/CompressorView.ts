import { FXView } from './FXView';
import $ from 'jquery';
import type { Compressor, CompressorParams } from './Compressor';

export class CompressorView extends FXView {
  attack: JQuery;
  release: JQuery;
  threshold: JQuery;
  ratio: JQuery;
  knee: JQuery;
  input: JQuery;
  output: JQuery;

  constructor(model: Compressor) {
    const dom = $('#tmpl_fx_compressor').clone();
    dom.removeAttr('id');
    super(model, dom);

    this.attack = this.dom.find('[name=attack]');
    this.release = this.dom.find('[name=release]');
    this.threshold = this.dom.find('[name=threshold]');
    this.ratio = this.dom.find('[name=ratio]');
    this.knee = this.dom.find('[name=knee]');
    this.input = this.dom.find('[name=input]');
    this.output = this.dom.find('[name=output]');

    this.initEvent();
  }

  initEvent() {
    super.initEvent();

    this.input.on('change', () => {
      this.model.setParam({
        input: parseFloat(this.input.val() as string) / 100.0,
      });
    });
    this.output.on('change', () => {
      this.model.setParam({
        output: parseFloat(this.output.val() as string) / 100.0,
      });
    });
    this.attack.on('change', () => {
      this.model.setParam({
        attack: parseFloat(this.attack.val() as string) / 1000.0,
      });
    });
    this.release.on('change', () => {
      this.model.setParam({
        release: parseFloat(this.release.val() as string) / 1000.0,
      });
    });
    this.threshold.on('change', () => {
      this.model.setParam({
        threshold: parseFloat(this.threshold.val() as string) / -10.0,
      }); // [0, 100]
    });
    this.ratio.on('change', () => {
      this.model.setParam({
        ratio: parseInt(this.ratio.val() as string),
      });
    });
    this.knee.on('change', () => {
      this.model.setParam({
        knee: parseFloat(this.knee.val() as string) / 1000.0,
      });
    });
  }

  setParam(p: Partial<CompressorParams>) {
    if (p.input !== undefined) {
      this.input.val(p.input * 100);
    }
    if (p.output !== undefined) {
      this.output.val(p.output * 100);
    }
    if (p.attack !== undefined) {
      this.attack.val(p.attack * 1000);
    }
    if (p.release !== undefined) {
      this.release.val(p.release * 1000);
    }
    if (p.threshold !== undefined) {
      this.threshold.val(p.threshold * -10);
    }
    if (p.ratio !== undefined) {
      this.ratio.val(p.ratio);
    }
    if (p.knee !== undefined) {
      this.knee.val(p.knee * 1000);
    }
  }
}
