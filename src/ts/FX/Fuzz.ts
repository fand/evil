/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FX from './FX';
import FuzzView from './FuzzView';


class Fuzz extends FX {
    constructor(ctx) {
        this.ctx = ctx;
        super(this.ctx);
        this.fuzz = this.ctx.createWaveShaper();
        this.in.connect(this.fuzz);
        this.fuzz.connect(this.out);
        this.in.gain.value = 1.0;
        this.out.gain.value = 1.0;
        this.type = 'Sigmoid';
        this.samples = 2048;
        this.fuzz.curve = new Float32Array(this.samples);
        this.setGain(0.08);

        this.view = new FuzzView(this);
    }

    setType(type) {
        this.type = type;
    }
    setGain(gain) {
        this.gain = gain;
        const sigmax = (2.0 / (1 + Math.exp(-this.gain * 1.0))) - 1.0;
        const ratio = 1.0 / sigmax;
        if (this.type === 'Sigmoid') {
            return (() => {
                const result = [];
                for (let i = 0, end = this.samples, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                    var x = ((i * 2.0) / this.samples) - 1.0;
                    var sigmoid = (2.0 / (1 + Math.exp(-Math.pow(this.gain, 3) * 1000 * x))) - 1.0;
                    result.push(this.fuzz.curve[i] = sigmoid * ratio);
                }
                return result;
            })();
        } else if (this.type === 'Octavia') {
            return (() => {
                const result1 = [];
                for (let i = 0, end1 = this.samples, asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
                    var x = ((i * 2.0) / this.samples) - 1.0;
                    var sigmoid = (2.0 / (1 + Math.exp(-Math.pow(this.gain, 2) * 10 * x))) - 1.0;
                    result1.push(this.fuzz.curve[i] = (Math.abs(sigmoid * ratio) * 2.0) - 1.0);
                }
                return result1;
            })();
        }
    }

    setParam(p) {
        if (p.type != null) { this.setType(p.type); }
        if (p.gain != null) { this.setGain(p.gain); }
        if (p.input != null) { this.setInput(p.input); }
        if (p.output != null) { this.setOutput(p.output); }
        return this.view.setParam(p);
    }

    getParam(p) {
        return {
            effect: 'Fuzz',
            type: this.type,
            gain: this.gain,
            input: this.in.gain.value,
            output: this.out.gain.value
        };
    }
}


// Export!
export default Fuzz;
