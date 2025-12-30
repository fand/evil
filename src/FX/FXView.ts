import type { FX } from './FX';

export class FXView {
  model: FX;
  dom: JQuery;
  dom_side: JQuery;
  minus_side: JQuery;

  constructor(model: FX, dom: JQuery) {
    this.model = model;
    this.dom = dom;
    this.dom_side = this.dom.find('.sidebar-effect');
    this.minus_side = this.dom_side.find('.sidebar-effect-minus');
  }

  initEvent() {
    this.minus_side.on('click', () => {
      this.model.remove();
      this.dom.remove();
    });
  }
}
