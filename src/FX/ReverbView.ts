import { FXView } from './FXView';
import $ from 'jquery';

import type { Reverb, ReverbParams } from './Reverb';

export class ReverbView extends FXView {
  name: JQuery;
  wet: JQuery;

  constructor(model: Reverb) {
    const dom = $('#tmpl_fx_reverb').clone();
    dom.removeAttr('id');
    super(model, dom);

    this.name = this.dom.find('[name=name]');
    this.wet = this.dom.find('[name=wet]');

    this.initEvent();
  }

  initEvent() {
    super.initEvent();
    this.name.on('change', () => {
      (this.model as Reverb).setIR(this.name.val() as string);
    });
    this.wet.on('change', () => {
      this.model.setParam({
        wet: parseFloat(this.wet.val() as string) / 100.0,
      });
    });
  }

  setParam(p: Partial<ReverbParams>) {
    if (p.name !== undefined) {
      this.name.val(p.name);
    }
    if (p.wet !== undefined) {
      this.wet.val(p.wet * 100);
    }
  }
}
