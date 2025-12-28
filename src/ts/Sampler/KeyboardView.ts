import Sampler from "../Sampler";
import SamplerView from "./View";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class SamplerKeyboardView {
  sequencer: SamplerView;
  on_dom: JQuery;
  off_dom: JQuery;
  canvas_on: HTMLCanvasElement;
  canvas_off: HTMLCanvasElement;
  ctx_on: CanvasRenderingContext2D;
  ctx_off: CanvasRenderingContext2D;

  w: number;
  h: number;
  cells_y: number;
  color: string[];
  is_clicked: boolean;
  hover_pos: number;
  click_pos: number;
  sample_last: number | undefined;

  rect: any;
  offset: { x: number; y: number } | undefined;

  constructor(sequencer: SamplerView) {
    // Keyboard
    this.sequencer = sequencer;
    this.on_dom = this.sequencer.dom.find(".keyboard-off");
    this.off_dom = this.sequencer.dom.find(".keyboard-on");
    this.canvas_on = this.on_dom[0] as HTMLCanvasElement;
    this.canvas_off = this.off_dom[0] as HTMLCanvasElement;
    this.ctx_on = this.canvas_on.getContext("2d");
    this.ctx_off = this.canvas_off.getContext("2d");

    this.w = 64;
    this.h = 26;
    this.cells_y = 10;
    this.color = [
      "rgba(230, 230, 230, 1.0)",
      "rgba(  250, 50, 230, 0.7)",
      "rgba(255, 100, 230, 0.7)",
      "rgba(200, 200, 200, 1.0)",
      "rgba(255, 255, 255, 1.0)",
    ];
    this.is_clicked = false;

    this.hover_pos = -1;
    this.click_pos = -1;

    this.initCanvas();
    this.initEvent();
  }

  initCanvas() {
    this.canvas_on.width = this.canvas_off.width = this.w;
    this.canvas_on.height = this.canvas_off.height = this.h * this.cells_y;
    this.rect = this.canvas_off.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    this.ctx_off.fillStyle = this.color[0];
    return (() => {
      const result = [];
      for (
        let i = 0, end = this.cells_y, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        this.drawNormal(i);
        result.push(this.drawText(i));
      }
      return result;
    })();
  }

  getPos(e) {
    this.rect = this.canvas_off.getBoundingClientRect();
    return Math.floor((e.clientY - this.rect.top) / this.h);
  }

  initEvent() {
    return this.off_dom
      .on("mousemove", (e) => {
        const pos = this.getPos(e);

        if (pos !== this.hover_pos) {
          this.drawNormal(this.hover_pos);
          this.drawHover(pos);
          this.hover_pos = pos;
        }

        if (this.is_clicked && this.click_pos !== pos) {
          this.clearActive(this.click_pos);
          this.drawActive(pos);
          this.sequencer.model.noteOff();
          this.sequencer.model.noteOn(this.cells_y - pos);
          this.click_pos = pos;
        }
      })
      .on("mousedown", (e) => {
        this.is_clicked = true;
        const pos = this.getPos(e);
        const note = this.cells_y - pos;
        this.sequencer.selectSample(note - 1);
        this.drawActive(pos);
        this.sequencer.model.noteOn(note);
        this.click_pos = pos;
      })
      .on("mouseup", (e) => {
        this.is_clicked = false;
        this.clearActive(this.click_pos);
        this.sequencer.model.noteOff();

        this.click_pos = -1;
      })
      .on("mouseout", (e) => {
        this.clearActive(this.hover_pos);
        this.sequencer.model.noteOff();
        this.hover_pos = -1;
        this.click_pos = -1;
      });
  }

  drawNormal(i: number) {
    this.clearNormal(i);
    this.ctx_off.fillStyle = this.color[0];
    this.ctx_off.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
    this.ctx_off.fillStyle = this.color[3];
    return this.ctx_off.fillText(
      ((this.cells_y - i - 1) % 7) + 1 + "th",
      10,
      (i + 1) * this.h - 10,
    );
  }

  drawHover(i) {
    this.ctx_off.fillStyle = this.color[1];
    this.ctx_off.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
    return this.ctx_off.fillText(
      ((this.cells_y - i - 1) % 7) + 1 + "th",
      10,
      (i + 1) * this.h - 10,
    );
  }

  drawActive(i) {
    this.clearNormal(i);
    this.ctx_off.fillStyle = this.color[2];
    this.ctx_off.fillRect(0, i * this.h, this.w, this.h);
    this.ctx_off.fillStyle = this.color[4];
    return this.ctx_off.fillText(
      ((this.cells_y - i - 1) % 7) + 1 + "th",
      10,
      (i + 1) * this.h - 10,
    );
  }

  clearNormal(i) {
    return this.ctx_off.clearRect(0, i * this.h, this.w, this.h);
  }

  clearActive(i: number) {
    this.clearNormal(i);
    this.drawNormal(i);
    return this.drawText(i);
  }

  drawText(i: number) {
    this.ctx_off.fillStyle = this.color[3];
    return this.ctx_off.fillText(
      ((this.cells_y - i - 1) % 7) + 1 + "th",
      10,
      (i + 1) * this.h - 10,
    );
  }

  selectSample(sample_now: number) {
    this.ctx_on.clearRect(
      0,
      (this.cells_y - this.sample_last - 1) * this.h,
      this.w,
      this.h,
    );
    this.ctx_on.fillStyle = "rgba(255, 200, 230, 0.3)";
    this.ctx_on.fillRect(
      0,
      (this.cells_y - sample_now - 1) * this.h,
      this.w,
      this.h,
    );
    return (this.sample_last = sample_now);
  }
}

export default SamplerKeyboardView;
