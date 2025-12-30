import $ from 'jquery';
import type { FXView } from './FXView';

export abstract class FX {
  abstract view: FXView;
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
    this.out.connect(dst);
  }
  disconnect() {
    this.out.disconnect();
  }

  setInput(d: number) {
    this.in.gain.value = d;
  }

  setOutput(d: number) {
    this.out.gain.value = d;
  }

  setDry(d: number) {
    this.dry.gain.value = d;
  }

  setWet(d: number) {
    this.wet.gain.value = d;
  }

  appendTo(dst: HTMLElement) {
    $(dst).append(this.view.dom);
    this.view.initEvent();
  }

  remove() {
    this.source.removeEffect(this);
  }

  setSource(source: any) {
    this.source = source;
  }

  setParam() {
    // Override in subclasses
  }

  getParam(): any {
    // Override in subclasses
    return {};
  }
}
