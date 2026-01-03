import { FXView } from './FXView';
import type { Compressor, CompressorParams } from './Compressor';

export class CompressorView extends FXView {
  attack: HTMLInputElement;
  release: HTMLInputElement;
  threshold: HTMLInputElement;
  ratio: HTMLInputElement;
  knee: HTMLInputElement;
  input: HTMLInputElement;
  output: HTMLInputElement;

  constructor(model: Compressor) {
    const template = document.getElementById('tmpl_fx_compressor')!;
    const dom = template.cloneNode(true) as HTMLElement;
    dom.removeAttribute('id');
    super(model, dom);

    this.attack = this.dom.querySelector('[name=attack]') as HTMLInputElement;
    this.release = this.dom.querySelector('[name=release]') as HTMLInputElement;
    this.threshold = this.dom.querySelector(
      '[name=threshold]'
    ) as HTMLInputElement;
    this.ratio = this.dom.querySelector('[name=ratio]') as HTMLInputElement;
    this.knee = this.dom.querySelector('[name=knee]') as HTMLInputElement;
    this.input = this.dom.querySelector('[name=input]') as HTMLInputElement;
    this.output = this.dom.querySelector('[name=output]') as HTMLInputElement;

    this.initEvent();
  }

  initEvent() {
    super.initEvent();

    this.input.addEventListener('change', () => {
      this.model.setParam({
        input: parseFloat(this.input.value) / 100.0,
      });
    });
    this.output.addEventListener('change', () => {
      this.model.setParam({
        output: parseFloat(this.output.value) / 100.0,
      });
    });
    this.attack.addEventListener('change', () => {
      this.model.setParam({
        attack: parseFloat(this.attack.value) / 1000.0,
      });
    });
    this.release.addEventListener('change', () => {
      this.model.setParam({
        release: parseFloat(this.release.value) / 1000.0,
      });
    });
    this.threshold.addEventListener('change', () => {
      this.model.setParam({
        threshold: parseFloat(this.threshold.value) / -10.0,
      }); // [0, 100]
    });
    this.ratio.addEventListener('change', () => {
      this.model.setParam({
        ratio: parseInt(this.ratio.value),
      });
    });
    this.knee.addEventListener('change', () => {
      this.model.setParam({
        knee: parseFloat(this.knee.value) / 1000.0,
      });
    });
  }

  setParam(p: Partial<CompressorParams>) {
    if (p.input !== undefined) {
      this.input.value = String(p.input * 100);
    }
    if (p.output !== undefined) {
      this.output.value = String(p.output * 100);
    }
    if (p.attack !== undefined) {
      this.attack.value = String(p.attack * 1000);
    }
    if (p.release !== undefined) {
      this.release.value = String(p.release * 1000);
    }
    if (p.threshold !== undefined) {
      this.threshold.value = String(p.threshold * -10);
    }
    if (p.ratio !== undefined) {
      this.ratio.value = String(p.ratio);
    }
    if (p.knee !== undefined) {
      this.knee.value = String(p.knee * 1000);
    }
  }
}
