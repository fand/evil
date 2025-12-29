/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { FXView } from './FXView';
import $ from 'jquery';

class DelayView extends FXView {
  delay: JQuery;
  feedback: JQuery;
  lofi: JQuery;
  wet: JQuery;

  constructor(model: any) {
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
      return this.model.setParam({
        wet: parseFloat(this.wet.val() as string) / 100.0,
      });
    });
    this.delay.on('change', () => {
      return this.model.setParam({
        delay: parseFloat(this.delay.val() as string) / 1000.0,
      });
    });
    this.feedback.on('change', () => {
      return this.model.setParam({
        feedback: parseFloat(this.feedback.val() as string) / 100.0,
      });
    });
    return this.lofi.on('change', () => {
      return this.model.setParam({
        lofi: (parseFloat(this.lofi.val() as string) * 5.0) / 100.0,
      });
    });
  }

  setParam(p) {
    if (p.delays != null) {
      this.delay.val(p.delay * 1000);
    }
    if (p.feedback != null) {
      this.feedback.val(p.feedback * 100);
    }
    if (p.lofi != null) {
      this.lofi.val(p.lofi * 20);
    }
    if (p.wet != null) {
      return this.wet.val(p.wet * 100);
    }
  }
}

export { DelayView };
