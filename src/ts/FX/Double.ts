/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import FX from './FX';
import DoubleView from './DoubleView';
import Panner from '../Panner';

class Double extends FX {
    constructor(ctx) {
        this.ctx = ctx;
        super(this.ctx);

        this.delay = this.ctx.createDelay();
        this.delay.delayTime.value = 0.03;

        this.pan_l = new Panner(this.ctx);
        this.pan_r = new Panner(this.ctx);
        this.setWidth([0, 0, -1]);

        this.in.connect(this.pan_l.in);
        this.in.connect(this.delay);
        this.delay.connect(this.pan_r.in);
        this.pan_l.connect(this.out);
        this.pan_r.connect(this.out);

        this.out.gain.value = 0.6;

        this.view = new DoubleView(this);
    }

    setDelay(d) { return this.delay.delayTime.value = d; }
    setWidth(pos) {
        this.pos = pos;
        this.pan_l.setPosition( this.pos);
        return this.pan_r.setPosition(-this.pos);
    }

    setParam(p) {
        if (p.delay != null) { this.setDelay(p.delay); }
        if (p.width != null) { this.setWidth(p.width); }
        return this.view.setParam(p);
    }

    getParam(p) {
        return {
            effect: 'Double',
            delay: this.delay.delayTime.value,
            width: this.pos
        };
    }
}


// Export!
export default Double;
