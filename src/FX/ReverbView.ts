import { FXView } from './FXView';

import type { Reverb, ReverbParams } from './Reverb';

export class ReverbView extends FXView {
  name: HTMLSelectElement;
  wet: HTMLInputElement;

  constructor(model: Reverb) {
    const template = document.getElementById('tmpl_fx_reverb')!;
    const dom = template.cloneNode(true) as HTMLElement;
    dom.removeAttribute('id');
    super(model, dom);

    this.name = this.dom.querySelector('[name=name]') as HTMLSelectElement;
    this.wet = this.dom.querySelector('[name=wet]') as HTMLInputElement;

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.name.addEventListener('change', () => {
      (this.model as Reverb).setIR(this.name.value);
    });
    this.wet.addEventListener('change', () => {
      this.model.setParam({
        wet: parseFloat(this.wet.value) / 100.0,
      });
    });
  }

  setParam(p: Partial<ReverbParams>) {
    if (p.name !== undefined) {
      this.name.value = p.name;
    }
    if (p.wet !== undefined) {
      this.wet.value = String(p.wet * 100);
    }
  }
}
