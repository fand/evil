import type { FX } from './FX';

export class FXView {
  model: FX;
  dom: HTMLElement;
  minus_side: HTMLElement;

  constructor(model: FX, dom: HTMLElement) {
    this.model = model;
    this.dom = dom;
    this.minus_side = this.dom.querySelector('.sidebar-effect-minus')!;
  }

  initEvent() {
    this.minus_side.addEventListener('click', () => {
      this.model.remove();
      this.dom.remove();
    });
  }
}
