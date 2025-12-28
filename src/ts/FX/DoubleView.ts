/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FXView from './FXView';
import $ from 'jquery';

class DoubleView extends FXView {
    delay: JQuery;
    width: JQuery;

    constructor(model: any) {
        const dom = $('#tmpl_fx_double').clone();
        dom.removeAttr('id');
        super(model, dom);

        this.delay  = this.dom.find('[name=delay]');
        this.width  = this.dom.find('[name=width]');

        this.initEvent();
    }

    initEvent() {
        super.initEvent();
        this.delay.on('change', () => {
            return this.model.setParam({delay: parseFloat(this.delay.val() as string) / 1000.0});
        });
        return this.width.on('change', () => {
            return this.model.setParam({width: (parseFloat(this.width.val() as string) / 200.0) + 0.5});  // [0.5, 1.0]
        });
    }

    setParam(p) {
        if (p.delay != null) { this.delay.val(p.delay * 1000); }
        if (p.width != null) { return this.width.val((p.width - 0.5) * 200); }
    }
};


export default DoubleView;
