/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

import { Player } from './Player';

const KEYCODE_TO_NOTE: Record<number, number> = {
  90: 1,
  88: 2,
  67: 3,
  86: 4,
  66: 5,
  78: 6,
  77: 7,
  65: 8,
  83: 9,
  68: 10,
  188: 8,
  190: 9,
  192: 10,
  70: 11,
  71: 12,
  72: 13,
  74: 14,
  75: 15,
  76: 16,
  187: 17,
  81: 15,
  87: 16,
  69: 17,
  82: 18,
  84: 19,
  89: 20,
  85: 21,
  73: 22,
  79: 23,
  80: 24,
  49: 22,
  50: 23,
  51: 24,
  52: 25,
  53: 26,
  54: 27,
  55: 28,
  56: 29,
  57: 30,
  48: 31,
};

const KEYCODE_TO_NUM: Record<number, number> = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5,
  54: 6,
  55: 7,
  56: 8,
  57: 9,
  48: 0,
};

class Keyboard {
  player: Player;
  mode: string;
  is_writing: boolean;
  is_pressed: boolean;
  last_key: number;
  solos: number[];

  constructor(player: Player) {
    this.player = player;
    this.mode = 'SYNTH';
    this.is_writing = false;
    this.is_pressed = false;

    this.last_key = 0;

    this.solos = [];

    this.initEvent();
  }

  initEvent() {
    window.addEventListener('keydown', (e) => {
      if (this.is_writing) {
        return;
      }
      this.is_pressed = true;
      this.noteOn(e.keyCode); // TODO: use e.code
    });
    window.addEventListener('keyup', (e) => {
      this.is_pressed = false;
      return this.noteOff(e.keyCode);
    });
  }

  beginInput() {
    return (this.is_writing = true);
  }
  endInput() {
    return (this.is_writing = false);
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  noteOn(keyCode: number) {
    if (keyCode === this.last_key) {
      return;
    }

    switch (keyCode) {
      case 37:
        this.player.view.moveLeft();
        break;
      case 38:
        this.player.view.moveTop();
        break;
      case 39:
        this.player.view.moveRight();
        break;
      case 40:
        this.player.view.moveBottom();
        break;
      case 32:
        this.player.view.viewPlay();
        break;
      case 13:
        this.player.view.viewPlay();
        break;
      default:
        if (this.mode === 'SYNTH') {
          this.onPlayer(keyCode);
        }
        if (this.mode === 'MIXER') {
          this.onMixer(keyCode);
        }
    }

    return (this.last_key = keyCode);
  }

  onPlayer(keyCode: number) {
    if (this.player.isPlaying()) {
      this.player.noteOff(true);
    }
    const n = KEYCODE_TO_NOTE[keyCode];
    if (n != null) {
      return this.player.noteOn(n, true);
    }
  }

  onMixer(e: KeyboardEvent | number) {
    const keyCode = typeof e === 'number' ? e : e.keyCode;
    // Session
    if (keyCode === 8 || keyCode === 46) {
      this.player.session.deleteCell();
    }

    // Mute
    const num = KEYCODE_TO_NUM[keyCode];
    if (num != null && num < 10) {
      if (!Array.from(this.solos).includes(num)) {
        this.solos.push(num);
      }
      return this.player.solo(this.solos);
    }
  }

  noteOff(keyCode: number) {
    if (this.mode === 'SYNTH') {
      this.offPlayer();
    }
    if (this.mode === 'MIXER') {
      this.offMixer(keyCode);
    }
    this.last_key = 0;
  }

  offPlayer() {
    return this.player.noteOff(true);
  }

  offMixer(keyCode: number) {
    const num = KEYCODE_TO_NUM[keyCode];
    if (num != null && num < 10) {
      this.solos = this.solos.filter((n) => n !== num);
      this.player.solo(this.solos);
    }
  }
}

export { Keyboard };
