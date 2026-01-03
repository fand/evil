import { FX } from './FX';
import { DoubleView } from './DoubleView';
import { Panner } from '../Panner';

export type DoubleParams = {
  delay: number;
  width: number;
};

export class Double extends FX {
  delay: DelayNode;
  pan_l: Panner;
  pan_r: Panner;
  pos: number = 1;

  override view: DoubleView;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.value = 0.03;

    this.pan_l = new Panner(this.ctx);
    this.pan_r = new Panner(this.ctx);
    this.pan_l.setPosition(this.pos);
    this.pan_r.setPosition(1 - this.pos);

    this.in.connect(this.pan_l.in);
    this.in.connect(this.delay);
    this.delay.connect(this.pan_r.in);
    this.pan_l.connect(this.out);
    this.pan_r.connect(this.out);

    this.out.gain.value = 0.7;

    this.view = new DoubleView(this);
  }

  setDelay(d: number) {
    this.delay.delayTime.value = d;
  }

  setWidth(pos: number) {
    this.pos = pos;

    this.pan_l.setPosition(this.pos);
    this.pan_r.setPosition(1 - this.pos);

    const centerness = (1 - pos) * 2;
    this.out.gain.value = 0.7 + centerness * 0.3;
  }

  setParam(p: Partial<DoubleParams>) {
    if (p.delay !== undefined) {
      this.setDelay(p.delay);
    }
    if (p.width !== undefined) {
      this.setWidth(p.width);
    }
    this.view.setParam(p);
  }

  getParam(): { effect: 'Double'; delay: number; width: number } {
    return {
      effect: 'Double',
      delay: this.delay.delayTime.value,
      width: this.pos,
    };
  }
}
