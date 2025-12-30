/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
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
      return this.model.setParam({
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
    if (p.delay != null) {
      this.delay.val(p.delay * 1000);
    }
    if (p.width != null) {
      this.width.val((p.width - 0.5) * 200);
    }
  }
}
