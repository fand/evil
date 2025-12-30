import type { Fuzz, FuzzParams } from './Fuzz';
import { FXView } from './FXView';
import $ from 'jquery';

export class FuzzView extends FXView {
  type: JQuery;
  gain: JQuery;
  input: JQuery;
  output: JQuery;

  constructor(model: Fuzz) {
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
      this.model.setParam({
        input: parseFloat(this.input.val() as string) / 100.0,
      });
    });
    this.output.on('change', () => {
      this.model.setParam({
        output: parseFloat(this.output.val() as string) / 100.0,
      });
    });
    this.type.on('change', () => {
      this.model.setParam({ type: this.type.val() as string });
    });
    this.gain.on('change', () => {
      this.model.setParam({
        gain: parseFloat(this.gain.val() as string) / 100.0,
      });
    });
  }

  setParam(p: Partial<FuzzParams>) {
    if (p.input !== undefined) {
      this.input.val(p.input * 100);
    }
    if (p.output !== undefined) {
      this.output.val(p.output * 100);
    }
    if (p.type !== undefined) {
      this.type.val(p.type);
    }
    if (p.gain !== undefined) {
      this.gain.val(p.gain * 100);
    }
  }
}
