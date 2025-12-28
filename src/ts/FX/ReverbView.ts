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
    name: JQuery;
    wet: JQuery;

    constructor(model: any) {
        const dom = $('#tmpl_fx_reverb').clone();
        dom.removeAttr('id');
        super(model, dom);

        this.name   = this.dom.find('[name=name]');
        this.wet  = this.dom.find('[name=wet]');

        this.initEvent();
    }

    initEvent() {
        super.initEvent();
        this.name.on('change', () => {
            return (this.model as any).setIR(this.name.val() as string);
        });
        return this.wet.on('change', () => {
            return this.model.setParam({wet: parseFloat(this.wet.val() as string) / 100.0});
        });
    }

    setParam(p) {
        if (p.name != null) { this.name.val(p.name); }
        if (p.wet != null) { return this.wet.val(p.wet * 100); }
    }
}


export default ReverbView;
