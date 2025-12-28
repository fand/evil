/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FXView from './FXView';
import $ from 'jquery';

class ReverbView extends FXView {
    constructor(model) {
        this.model = model;
        this.dom = $('#tmpl_fx_reverb').clone();
        this.dom.removeAttr('id');

        super(this.model, this.dom);

        this.name   = this.dom.find('[name=name]');
        this.wet  = this.dom.find('[name=wet]');

        this.initEvent();
    }

    initEvent() {
        super.initEvent();
        this.name.on('change', () => {
            return this.model.setIR(this.name.val());
        });
        return this.wet.on('change', () => {
            return this.model.setParam({wet: parseFloat(this.wet.val()) / 100.0});
        });
    }

    setParam(p) {
        if (p.name != null) { this.name.val(p.name); }
        if (p.wet != null) { return this.wet.val(p.wet * 100); }
    }
}


export default ReverbView;
