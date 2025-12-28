/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Panner {
    constructor(ctx) {
        this.ctx = ctx;
        this.in = this.ctx.createChannelSplitter(2);
        this.out = this.ctx.createChannelMerger(2);
        this.l = this.ctx.createGain();
        this.r = this.ctx.createGain();
        this.in.connect(this.l, 0);
        this.in.connect(this.r, 1);
        this.l.connect(this.out, 0, 0);
        this.r.connect(this.out, 0, 1);
        this.setPosition(0.5);
    }

    connect(dst) { return this.out.connect(dst); }

    setPosition(pos) {
        this.pos = pos;
        this.l.gain.value = this.pos;
        return this.r.gain.value = 1.0 - this.pos;
    }
}


// Export!
export default Panner;
