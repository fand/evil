import { FXView } from './FXView';
import $ from 'jquery';

import type { Double, DoubleParams } from './Double';

export class DoubleView extends FXView {
  delay: JQuery;
  width: JQuery;

  constructor(model: Double) {
    const dom = $('#tmpl_fx_double').clone();
    dom.removeAttr('id');
    super(model, dom);

    this.delay = this.dom.find('[name=delay]');
    this.width = this.dom.find('[name=width]');

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.delay.on('change', () => {
      this.model.setParam({
        delay: parseFloat(this.delay.val() as string) / 1000.0,
      });
    });
    this.width.on('change', () => {
      this.model.setParam({
        width: parseFloat(this.width.val() as string) / 200.0 + 0.5,
      }); // [0.5, 1.0]
    });
  }

  setParam(p: Partial<DoubleParams>) {
    if (p.delay !== undefined) {
      this.delay.val(p.delay * 1000);
    }
    if (p.width !== undefined) {
      this.width.val((p.width - 0.5) * 200);
    }
  }
}
