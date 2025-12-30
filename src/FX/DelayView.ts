import { FXView } from './FXView';
import $ from 'jquery';

import type { Delay, DelayParams } from './Delay';

export class DelayView extends FXView {
  delay: JQuery;
  feedback: JQuery;
  lofi: JQuery;
  wet: JQuery;

  constructor(model: Delay) {
    const dom = $('#tmpl_fx_delay').clone();
    dom.removeAttr('id');
    super(model, dom);

    this.delay = this.dom.find('[name=delay]');
    this.feedback = this.dom.find('[name=feedback]');
    this.lofi = this.dom.find('[name=lofi]');
    this.wet = this.dom.find('[name=wet]');

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.wet.on('change', () => {
      this.model.setParam({
        wet: parseFloat(this.wet.val() as string) / 100.0,
      });
    });
    this.delay.on('change', () => {
      this.model.setParam({
        delay: parseFloat(this.delay.val() as string) / 1000.0,
      });
    });
    this.feedback.on('change', () => {
      this.model.setParam({
        feedback: parseFloat(this.feedback.val() as string) / 100.0,
      });
    });
    this.lofi.on('change', () => {
      this.model.setParam({
        lofi: (parseFloat(this.lofi.val() as string) * 5.0) / 100.0,
      });
    });
  }

  setParam(p: Partial<DelayParams>) {
    if (p.delay !== undefined) {
      this.delay.val(p.delay * 1000);
    }
    if (p.feedback !== undefined) {
      this.feedback.val(p.feedback * 100);
    }
    if (p.lofi !== undefined) {
      this.lofi.val(p.lofi * 20);
    }
    if (p.wet !== undefined) {
      this.wet.val(p.wet * 100);
    }
  }
}
