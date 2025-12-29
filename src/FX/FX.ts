/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';

class FX {
  view: any;
  protected ctx: AudioContext;
  in: GainNode;
  protected dry: GainNode;
  wet: GainNode;
  out: GainNode;
  protected source: any;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.in = this.ctx.createGain();
    this.in.gain.value = 1.0;
    this.dry = this.ctx.createGain();
    this.dry.gain.value = 1.0;
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 1.0;
    this.out = this.ctx.createGain();
    this.out.gain.value = 1.0;
  }

  connect(dst: AudioNode) {
    return this.out.connect(dst);
  }
  disconnect() {
    return this.out.disconnect();
  }

  setInput(d: number) {
    return (this.in.gain.value = d);
  }
  setOutput(d: number) {
    return (this.out.gain.value = d);
  }
  setDry(d: number) {
    return (this.dry.gain.value = d);
  }
  setWet(d: number) {
    return (this.wet.gain.value = d);
  }

  appendTo(dst: HTMLElement) {
    $(dst).append(this.view.dom);
    return this.view.initEvent();
  }

  remove() {
    return this.source.removeEffect(this);
  }

  setSource(source: any) {
    this.source = source;
  }

  setParam(p: any) {
    // Override in subclasses
  }

  getParam(): any {
    // Override in subclasses
    return {};
  }
}

export { FX };
