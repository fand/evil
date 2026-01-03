import { FXView } from './FXView';

import type { Double, DoubleParams } from './Double';

export class DoubleView extends FXView {
  delay: HTMLInputElement;
  width: HTMLInputElement;

  constructor(model: Double) {
    const template = document.getElementById('tmpl_fx_double')!;
    const dom = template.cloneNode(true) as HTMLElement;
    dom.removeAttribute('id');
    super(model, dom);

    this.delay = this.dom.querySelector('[name=delay]') as HTMLInputElement;
    this.width = this.dom.querySelector('[name=width]') as HTMLInputElement;

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.delay.addEventListener('change', () => {
      this.model.setParam({
        delay: parseFloat(this.delay.value) / 1000.0,
      });
    });
    this.width.addEventListener('change', () => {
      this.model.setParam({
        width: parseFloat(this.width.value) / 200.0 + 0.5,
      }); // [0.5, 1.0]
    });
  }

  setParam(p: Partial<DoubleParams>) {
    if (p.delay !== undefined) {
      this.delay.value = String(p.delay * 1000);
    }
    if (p.width !== undefined) {
      this.width.value = String((p.width - 0.5) * 200);
    }
  }
}
