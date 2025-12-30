/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';
import { KEY_LIST } from './Constant';
import type { Player } from './Player';

declare global {
  interface Window {
    keyboard: any;
  }
}

export class PlayerView {
  model: Player;
  dom: JQuery;
  bpm: JQuery;
  key: JQuery;
  scale: JQuery;
  footer: JQuery;
  play: JQuery;
  stop: JQuery;
  forward: JQuery;
  backward: JQuery;
  loop: JQuery;
  wrapper: JQuery;
  instruments: JQuery;
  mixer: JQuery;
  is_mixer: boolean;
  btn_left: JQuery;
  btn_right: JQuery;
  btn_top: JQuery;
  btn_bottom: JQuery;
  synth_now: number;
  synth_total: number;

  constructor(model: Player) {
    this.model = model;
    this.dom = $('#control');

    this.bpm = this.dom.find('[name=bpm]');
    this.key = this.dom.find('[name=key]');
    this.scale = this.dom.find('[name=mode]');

    this.footer = $('footer');

    this.play = $('#control-play');
    this.stop = $('#control-stop');
    this.forward = $('#control-forward');
    this.backward = $('#control-backward');
    this.loop = $('#control-loop');

    this.wrapper = $('#wrapper');
    this.instruments = $('#instruments');
    this.mixer = $('#mixer');
    this.is_mixer = false; // seeing mixer?

    this.btn_left = $('#btn-left');
    this.btn_right = $('#btn-right');
    this.btn_top = $('#btn-top');
    this.btn_bottom = $('#btn-bottom');
    this.synth_now = 0;
    this.synth_total = 1;

    this.initEvent();
    this.resize();
  }

  initEvent() {
    this.dom.on('change', () => {
      this.model.setBPM(parseInt(this.bpm.val() as string));
      this.model.setKey(this.key.val() as string);
      return this.model.setScale(this.scale.val() as string);
    });

    this.bpm
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput());
    this.key
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput());
    this.scale
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput());

    this.play.on('mousedown', () => this.viewPlay());
    this.stop.on('mousedown', () => this.viewStop(this.model));
    this.forward.on('mousedown', () => this.model.forward());
    this.backward.on('mousedown', () => this.model.backward(false));
    this.loop.on('mousedown', () => {
      if (this.model.toggleLoop()) {
        return this.loop.removeClass('control-off').addClass('control-on');
      } else {
        return this.loop.removeClass('control-on').addClass('control-off');
      }
    });

    this.btn_left.on('mousedown', () => this.moveLeft());
    this.btn_right.on('mousedown', () => this.moveRight());
    this.btn_top.on('mousedown', () => this.moveTop());
    this.btn_bottom.on('mousedown', () => this.moveBottom());

    return $(window).on('resize', () => this.resize());
  }

  viewPlay() {
    if (this.model.isPlaying()) {
      this.model.pause();
      return this.play.removeClass('fa-pause').addClass('fa-play');
    } else {
      this.model.play();
      return this.play.removeClass('fa-play').addClass('fa-pause');
    }
  }

  viewStop(receiver?: any) {
    if (receiver != null) {
      receiver.stop();
    }
    return this.play.removeClass('fa-pause').addClass('fa-play');
  }

  setBPM(bpm: number) {
    return this.bpm.val(bpm);
  }

  setScale(scale: string) {
    return this.scale.val(scale);
  }

  setKey(key: string) {
    for (const k in KEY_LIST) {
      const v = KEY_LIST[k as keyof typeof KEY_LIST];
      if (v === parseInt(key, 10)) {
        this.key.val(k);
        break;
      }
    }
  }

  setParam(bpm: number, key: string, scale: string) {
    this.setBPM(bpm);
    this.setKey(key);
    return this.setScale(scale);
  }

  moveRight() {
    if (this.is_mixer) {
      return;
    }

    this.synth_now++;
    this.model.moveRight(this.synth_now);
    this.synth_total = this.model.synth.length;

    this.instruments.css(
      '-webkit-transform',
      'translate3d(' + -1110 * this.synth_now + 'px, 0px, 0px)'
    );
    this.btn_left.show();
    if (this.synth_now === this.synth_total - 1) {
      this.btn_right.attr('data-line1', 'new');
    }
  }

  moveLeft() {
    if (this.is_mixer) {
      return;
    }
    this.synth_total = this.model.synth.length;
    this.btn_right.attr('data-line1', 'next');
    if (this.synth_now !== 0) {
      this.synth_now--;
      this.instruments.css(
        '-webkit-transform',
        'translate3d(' + -1110 * this.synth_now + 'px, 0px, 0px)'
      );
      this.model.moveLeft(this.synth_now);
    }
    if (this.synth_now === 0) {
      this.btn_left.hide();
    }
  }

  moveTop() {
    this.is_mixer = true;
    this.btn_left.hide();
    this.btn_right.hide();
    this.btn_top.hide();
    this.btn_bottom.show();
    this.wrapper.css('-webkit-transform', 'translate3d(0px, 700px, 0px)');
    this.model.moveTop();
  }

  moveBottom() {
    this.is_mixer = false;
    if (this.synth_now !== 0) {
      this.btn_left.show();
    }
    this.btn_right.show();
    this.btn_top.show();
    this.btn_bottom.hide();
    this.wrapper.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
    this.model.moveBottom();
  }

  setSynthNum(total: number, now: number) {
    this.synth_total = total;
    if (now < total - 1) {
      return this.btn_right.attr('data-line1', 'next');
    }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const space_w = (w - 910) / 2;
    const space_h = (h - 600) / 2;

    const pw = space_w / 2 - 50;
    const ph = space_h / 2 - 50;

    this.btn_left.css({
      width: space_w + 'px',
      padding: '250px ' + 25 + 'px',
    });
    this.btn_right.css({
      width: space_w + 'px',
      padding: '250px ' + 35 + 'px',
    });
    this.btn_top.css({
      height: space_h + 'px',
    });
    this.btn_bottom.css({
      bottom: space_h + 'px',
      height: 100 + 'px',
    });
    return this.footer.css({
      height: space_h + 'px',
    });
  }

  changeSynth(_id?: number, _type?: string) {
    if (this.synth_now === 0) {
      this.btn_left.hide();
    }
    if (this.synth_now === this.synth_total - 1) {
      return this.btn_right.attr('data-line1', 'new');
    }
  }

  empty() {
    return this.instruments.empty();
  }
}
