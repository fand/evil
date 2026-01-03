import { FXView } from './FXView';

import type { Delay, DelayParams } from './Delay';

export class DelayView extends FXView {
  delay: HTMLInputElement;
  feedback: HTMLInputElement;
  lofi: HTMLInputElement;
  wet: HTMLInputElement;

  constructor(model: Delay) {
    const template = document.getElementById('tmpl_fx_delay')!;
    const dom = template.cloneNode(true) as HTMLElement;
    dom.removeAttribute('id');
    super(model, dom);

    this.delay = this.dom.querySelector('[name=delay]') as HTMLInputElement;
    this.feedback = this.dom.querySelector(
      '[name=feedback]'
    ) as HTMLInputElement;
    this.lofi = this.dom.querySelector('[name=lofi]') as HTMLInputElement;
    this.wet = this.dom.querySelector('[name=wet]') as HTMLInputElement;

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.wet.addEventListener('change', () => {
      this.model.setParam({
        wet: parseFloat(this.wet.value) / 100.0,
      });
    });
    this.delay.addEventListener('change', () => {
      this.model.setParam({
        delay: parseFloat(this.delay.value) / 1000.0,
      });
    });
    this.feedback.addEventListener('change', () => {
      this.model.setParam({
        feedback: parseFloat(this.feedback.value) / 100.0,
      });
    });
    this.lofi.addEventListener('change', () => {
      this.model.setParam({
        lofi: (parseFloat(this.lofi.value) * 5.0) / 100.0,
      });
    });
  }

  setParam(p: Partial<DelayParams>) {
    if (p.delay !== undefined) {
      this.delay.value = String(p.delay * 1000);
    }
    if (p.feedback !== undefined) {
      this.feedback.value = String(p.feedback * 100);
    }
    if (p.lofi !== undefined) {
      this.lofi.value = String(p.lofi * 20);
    }
    if (p.wet !== undefined) {
      this.wet.value = String(p.wet * 100);
    }
  }
}
