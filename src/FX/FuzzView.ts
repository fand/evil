import type { Fuzz, FuzzParams } from './Fuzz';
import { FXView } from './FXView';

export class FuzzView extends FXView {
  type: HTMLSelectElement;
  gain: HTMLInputElement;
  input: HTMLInputElement;
  output: HTMLInputElement;

  constructor(model: Fuzz) {
    const template = document.getElementById('tmpl_fx_fuzz')!;
    const dom = template.cloneNode(true) as HTMLElement;
    dom.removeAttribute('id');
    super(model, dom);

    this.type = this.dom.querySelector('[name=type]') as HTMLSelectElement;
    this.gain = this.dom.querySelector('[name=gain]') as HTMLInputElement;
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
    this.type.addEventListener('change', () => {
      this.model.setParam({ type: this.type.value });
    });
    this.gain.addEventListener('change', () => {
      this.model.setParam({
        gain: parseFloat(this.gain.value) / 100.0,
      });
    });
  }

  setParam(p: Partial<FuzzParams>) {
    if (p.input !== undefined) {
      this.input.value = String(p.input * 100);
    }
    if (p.output !== undefined) {
      this.output.value = String(p.output * 100);
    }
    if (p.type !== undefined) {
      this.type.value = p.type;
    }
    if (p.gain !== undefined) {
      this.gain.value = String(p.gain * 100);
    }
  }
}
