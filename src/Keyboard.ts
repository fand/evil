import { Player } from './Player';

const CODE_TO_NOTE: Record<string, number> = {
  KeyZ: 1,
  KeyX: 2,
  KeyC: 3,
  KeyV: 4,
  KeyB: 5,
  KeyN: 6,
  KeyM: 7,
  KeyA: 8,
  KeyS: 9,
  KeyD: 10,
  Comma: 8,
  Period: 9,
  Backquote: 10,
  KeyF: 11,
  KeyG: 12,
  KeyH: 13,
  KeyJ: 14,
  KeyK: 15,
  KeyL: 16,
  Equal: 17,
  KeyQ: 15,
  KeyW: 16,
  KeyE: 17,
  KeyR: 18,
  KeyT: 19,
  KeyY: 20,
  KeyU: 21,
  KeyI: 22,
  KeyO: 23,
  KeyP: 24,
  Digit1: 22,
  Digit2: 23,
  Digit3: 24,
  Digit4: 25,
  Digit5: 26,
  Digit6: 27,
  Digit7: 28,
  Digit8: 29,
  Digit9: 30,
  Digit0: 31,
};

const CODE_TO_NUM: Record<string, number> = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 3,
  Digit4: 4,
  Digit5: 5,
  Digit6: 6,
  Digit7: 7,
  Digit8: 8,
  Digit9: 9,
  Digit0: 0,
};

class Keyboard {
  player: Player;
  mode: string;
  is_writing: boolean;
  is_pressed: boolean;
  last_key: string;
  solos: number[];

  constructor(player: Player) {
    this.player = player;
    this.mode = 'SYNTH';
    this.is_writing = false;
    this.is_pressed = false;

    this.last_key = '';

    this.solos = [];

    this.initEvent();
  }

  initEvent() {
    window.addEventListener('keydown', (e) => {
      if (this.is_writing) {
        return;
      }
      this.is_pressed = true;
      this.noteOn(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.is_pressed = false;
      this.noteOff(e.code);
    });
  }

  beginInput() {
    this.is_writing = true;
  }
  endInput() {
    this.is_writing = false;
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  noteOn(code: string) {
    if (code === this.last_key) {
      return;
    }

    switch (code) {
      case 'ArrowLeft':
        this.player.view.moveLeft();
        break;
      case 'ArrowUp':
        this.player.view.moveTop();
        break;
      case 'ArrowRight':
        this.player.view.moveRight();
        break;
      case 'ArrowDown':
        this.player.view.moveBottom();
        break;
      case 'Space':
      case 'Enter':
        this.player.view.viewPlay();
        break;
      default:
        if (this.mode === 'SYNTH') {
          this.onPlayer(code);
        }
        if (this.mode === 'MIXER') {
          this.onMixer(code);
        }
    }

    this.last_key = code;
  }

  onPlayer(code: string) {
    if (this.player.isPlaying()) {
      this.player.noteOff(true);
    }
    const n = CODE_TO_NOTE[code];
    if (n !== undefined) {
      this.player.noteOn(n, true);
    }
  }

  onMixer(code: string) {
    // Session
    if (code === 'Backspace' || code === 'Delete') {
      this.player.session.deleteCell();
    }

    // Mute
    const num = CODE_TO_NUM[code];
    if (num !== undefined && num < 10) {
      if (!this.solos.includes(num)) {
        this.solos.push(num);
      }
      this.player.solo(this.solos);
    }
  }

  noteOff(code: string) {
    if (this.mode === 'SYNTH') {
      this.offPlayer();
    }
    if (this.mode === 'MIXER') {
      this.offMixer(code);
    }
    this.last_key = '';
  }

  offPlayer() {
    this.player.noteOff(true);
  }

  offMixer(code: string) {
    const num = CODE_TO_NUM[code];
    if (num !== undefined && num < 10) {
      this.solos = this.solos.filter((n) => n !== num);
      this.player.solo(this.solos);
    }
  }
}

export { Keyboard };
