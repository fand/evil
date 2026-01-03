import type { FX } from './FX';

export class FXView {
  model: FX;
  dom: HTMLElement;
  dom_side: HTMLElement;
  minus_side: HTMLElement;

  constructor(model: FX, dom: HTMLElement) {
    this.model = model;
    this.dom = dom;
    this.dom_side = this.dom.querySelector('.sidebar-effect')!;
    this.minus_side = this.dom_side.querySelector('.sidebar-effect-minus')!;
  }

  initEvent() {
    this.minus_side.addEventListener('click', () => {
      this.model.remove();
      this.dom.remove();
    });
  }
}
