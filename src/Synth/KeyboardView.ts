/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export class KeyboardView {
  sequencer: any;
  dom: JQuery;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  num: number;
  color: string[];
  is_clicked: boolean;
  hover_pos: { x: number; y: number } | number;
  click_pos: { x: number; y: number } | number;
  scale: number[];
  rect: DOMRect;
  offset: { x: number; y: number };

  constructor(sequencer: any) {
    // Keyboard
    this.sequencer = sequencer;
    this.dom = this.sequencer.dom.find('.keyboard');
    this.canvas = this.dom[0] as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.w = 48;
    this.h = 26;
    this.num = 20;
    this.color = [
      'rgba(230, 230, 230, 1.0)',
      'rgba(  0, 220, 250, 0.7)',
      'rgba(100, 230, 255, 0.7)',
      'rgba(200, 200, 200, 1.0)',
      'rgba(255, 255, 255, 1.0)',
    ];
    this.is_clicked = false;
    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };

    this.scale = this.sequencer.model.scale;

    // Initialize rect and offset before initCanvas
    this.rect = this.canvas.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    this.initCanvas();
    this.initEvent();
  }

  initCanvas() {
    this.canvas.width = this.w;
    this.canvas.height = this.h * this.num;
    this.rect = this.canvas.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    this.ctx.fillStyle = this.color[0];
    return Array.from({ length: this.num }, (_, i) => this.drawNormal(i));
  }

  getPos(e: JQuery.MouseEventBase) {
    this.rect = this.canvas.getBoundingClientRect();
    return Math.floor((e.clientY - this.rect.top) / this.h);
  }

  initEvent() {
    return this.dom
      .on('mousemove', (e) => {
        const pos = this.getPos(e);

        if (pos !== this.hover_pos) {
          this.drawNormal(this.hover_pos);
          this.drawHover(pos);
          this.hover_pos = pos;
        }

        if (this.is_clicked && this.click_pos !== pos) {
          this.clearActive(this.click_pos);
          this.drawActive(pos);
          this.sequencer.model.noteOff(true);
          this.sequencer.model.noteOn(this.num - pos, true);
          return (this.click_pos = pos);
        }
      })
      .on('mousedown', (e) => {
        this.is_clicked = true;
        const pos = this.getPos(e);
        this.drawActive(pos);
        this.sequencer.model.noteOn(this.num - pos, true);
        return (this.click_pos = pos);
      })
      .on('mouseup', (e) => {
        this.is_clicked = false;
        this.clearActive(this.click_pos);
        this.sequencer.model.noteOff(true);
        return (this.click_pos = { x: -1, y: -1 });
      })
      .on('mouseout', (e) => {
        this.clearActive(this.hover_pos);
        this.sequencer.model.noteOff(true);
        this.hover_pos = { x: -1, y: -1 };
        return (this.click_pos = { x: -1, y: -1 });
      });
  }

  drawNormal(i: number | { x: number; y: number }) {
    if (typeof i !== 'number') return;
    this.clearNormal(i);
    this.ctx.fillStyle = this.color[0];
    if (this.isKey(i)) {
      this.ctx.fillRect(0, (i + 1) * this.h - 5, this.w, 2);
    }
    this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
    this.ctx.fillStyle = this.color[3];
    return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
  }

  drawHover(i: number) {
    this.ctx.fillStyle = this.color[1];
    this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
    if (this.isKey(i)) {
      this.ctx.fillRect(0, (i + 1) * this.h - 5, this.w, 2);
    }
    return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
  }

  drawActive(i: number) {
    this.clearNormal(i);
    this.ctx.fillStyle = this.color[2];
    this.ctx.fillRect(0, i * this.h, this.w, this.h);
    this.ctx.fillStyle = this.color[4];
    return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
  }

  clearNormal(i: number | { x: number; y: number }) {
    if (typeof i !== 'number') return;
    return this.ctx.clearRect(0, i * this.h, this.w, this.h);
  }

  clearActive(i: number | { x: number; y: number }) {
    this.clearNormal(i);
    return this.drawNormal(i);
  }

  changeScale(scale: number[]) {
    this.scale = scale;
    return Array.from({ length: this.num }, (_, i) => this.drawNormal(i));
  }

  text(i: number) {
    return ((this.num - i - 1) % this.scale.length) + 1 + 'th';
  }

  isKey(i: number) {
    return (this.num - i - 1) % this.scale.length === 0;
  }
}
