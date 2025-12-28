/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FX from './FX';
import DelayView from './DelayView';

class Delay extends FX {
    delay: DelayNode;
    lofi: BiquadFilterNode;
    feedback: GainNode;

    constructor(ctx: AudioContext) {
        super(ctx);
        this.delay = this.ctx.createDelay();
        this.delay.delayTime.value = 0.23;

        this.lofi = this.ctx.createBiquadFilter();
        this.lofi.type = "peaking";
        this.lofi.frequency.value = 1200;
        this.lofi.Q.value = 0.0;  // range is [0.0, 5.0]
        this.lofi.gain.value = 1.0;

        this.feedback = this.ctx.createGain();
        this.feedback.gain.value = 0.2;

        this.in.connect(this.lofi);
        this.lofi.connect(this.delay);
        this.delay.connect(this.wet);
        this.delay.connect(this.feedback);
        this.feedback.connect(this.lofi);

        this.wet.connect(this.out);
        this.in.connect(this.out);

        this.view = new DelayView(this);
    }

    setDelay(d) { return this.delay.delayTime.value = d; }
    setFeedback(d) { return this.feedback.gain.value = d; }
    setLofi(d) { return this.lofi.Q.value = d; }

    setParam(p) {
        if (p.delay != null) { this.setDelay(p.delay); }
        if (p.feedback != null) { this.setFeedback(p.feedback); }
        if (p.lofi != null) { this.setLofi(p.lofi); }
        if (p.wet != null) { this.setWet(p.wet); }
        return this.view.setParam(p);
    }

    getParam() {
        return {
            effect: 'Delay',
            delay: this.delay.delayTime.value,
            feedback: this.feedback.gain.value,
            lofi: this.lofi.Q.value,
            wet: this.wet.gain.value
        };
    }
}


// Export!
export default Delay;
