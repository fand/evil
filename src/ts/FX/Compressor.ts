/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FX from './FX';
import CompressorView from './CompressorView';

class Compressor extends FX {
    constructor(ctx) {
        this.ctx = ctx;
        super(this.ctx);
        this.comp = this.ctx.createDynamicsCompressor();
        this.in.connect(this.comp);
        this.comp.connect(this.out);
        this.in.gain.value = 1.0;
        this.out.gain.value = 1.0;

        this.view = new CompressorView(this);
    }

    setAttack(d) { return this.comp.attack.value = d; }
    setRelease(d) { return this.comp.release.value = d; }
    setThreshold(d) { return this.comp.threshold.value = d; }
    setRatio(d) { return this.comp.ratio.value = d; }
    setKnee(d) { return this.comp.knee.value = d; }

    setParam(p) {
        if (p.attack != null) { this.setAttack(p.attack); }
        if (p.release != null) { this.setRelease(p.release); }
        if (p.threshold != null) { this.setThreshold(p.threshold); }
        if (p.ratio != null) { this.setRatio(p.ratio); }
        if (p.knee != null) { this.setKnee(p.knee); }
        if (p.input != null) { this.setInput(p.input); }
        if (p.output != null) { this.setOutput(p.output); }
        return this.view.setParam(p);
    }

    getParam(p) {
        return {
            effect: 'Compressor',
            attack:  this.comp.attack.value,
            release: this.comp.release.value,
            threshold: this.comp.threshold.value,
            ratio: this.comp.ratio.value,
            knee: this.comp.knee.value,
            input: this.in.gain.value,
            output: this.out.gain.value
        };
    }
}


// Export!
export default Compressor;
