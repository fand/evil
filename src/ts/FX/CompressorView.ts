/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FXView from './FXView';
import $ from 'jquery';


class CompressorView extends FXView {
    constructor(model) {
        this.model = model;
        this.dom = $('#tmpl_fx_compressor').clone();
        this.dom.removeAttr('id');
        super(this.model, this.dom);

        this.attack    = this.dom.find('[name=attack]');
        this.release   = this.dom.find('[name=release]');
        this.threshold = this.dom.find('[name=threshold]');
        this.ratio     = this.dom.find('[name=ratio]');
        this.knee      = this.dom.find('[name=knee]');
        this.input     = this.dom.find('[name=input]');
        this.output    = this.dom.find('[name=output]');

        this.initEvent();
    }

    initEvent() {
        super.initEvent();
        this.input.on('change', () => {
            return this.model.setParam({input: parseFloat(this.input.val()) / 100.0});
        });
        this.output.on('change', () => {
            return this.model.setParam({output: parseFloat(this.output.val()) / 100.0});
        });
        this.attack.on('change', () => {
            return this.model.setParam({attack: parseFloat(this.attack.val()) / 1000.0});
        });
        this.release.on('change', () => {
            return this.model.setParam({release: parseFloat(this.release.val()) / 1000.0});
        });
        this.threshold.on('change', () => {
            return this.model.setParam({threshold: (parseFloat(this.threshold.val()) / -10.0)});   // [0, 100]
        });
        this.ratio.on('change', () => {
            return this.model.setParam({ratio: parseInt(this.ratio.val())});
        });
        return this.knee.on('change', () => {
            return this.model.setParam({knee: parseFloat(this.knee.val()) / 1000.0});
        });
    }

    setParam(p) {
        if (p.input != null) { this.input.val(p.input * 100); }
        if (p.output != null) { this.output.val(p.output * 100); }
        if (p.attacks != null) { this.attack.val(p.attack * 1000); }
        if (p.release != null) { this.release.val(p.release * 1000); }
        if (p.threshold != null) { this.threshold.val(p.threshold * -10); }
        if (p.ratio != null) { this.ratio.val(p.ratio); }
        if (p.knee != null) { return this.knee.val(p.knee * 1000); }
    }
}


export default CompressorView;
