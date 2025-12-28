/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FXView from './FXView';
import $ from 'jquery';

class FuzzView extends FXView {
  type: JQuery;
  gain: JQuery;
  input: JQuery;
  output: JQuery;

  constructor(model: any) {
    const dom = $('#tmpl_fx_fuzz').clone();
    dom.removeAttr('id');
    super(model, dom);

    this.type = this.dom.find('[name=type]');
    this.gain = this.dom.find('[name=gain]');
    this.input = this.dom.find('[name=input]');
    this.output = this.dom.find('[name=output]');

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.input.on('change', () => {
      return this.model.setParam({
        input: parseFloat(this.input.val() as string) / 100.0,
      });
    });
    this.output.on('change', () => {
      return this.model.setParam({
        output: parseFloat(this.output.val() as string) / 100.0,
      });
    });
    this.type.on('change', () => {
      return this.model.setParam({ type: this.type.val() as string });
    });
    return this.gain.on('change', () => {
      return this.model.setParam({
        gain: parseFloat(this.gain.val() as string) / 100.0,
      });
    });
  }

  setParam(p) {
    if (p.input != null) {
      this.input.val(p.input * 100);
    }
    if (p.output != null) {
      this.output.val(p.output * 100);
    }
    if (p.type != null) {
      this.type.val(p.type);
    }
    if (p.gain != null) {
      return this.gain.val(p.gain * 100);
    }
  }
}

export default FuzzView;
