/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';
import { KeyboardView } from './KeyboardView';
import type { Synth } from '../Synth';

declare global {
  interface Window {
    keyboard: any;
  }
}

// TODO: merge with SamplerPattern
type SynthPattern = (number | 'sustain' | 'end')[];

const DEFAULT_PATTERN: SynthPattern = [];

type SynthPatternObject = { name: string; pattern: SynthPattern };

type SynthPos = {
  x: number;
  y: number;
  x_abs: number;
  y_abs: number;
  note: number;
};

class SynthView {
  model: Synth;
  id: number;
  dom: JQuery;
  synth_name: JQuery;
  pattern_name: JQuery;
  synth_type: JQuery;
  pencil: JQuery;
  step: JQuery;
  is_step: boolean;
  header: JQuery;
  markers: JQuery;
  pos_markers: JQuery;
  marker_prev: JQuery;
  marker_next: JQuery;
  plus: JQuery;
  minus: JQuery;
  nosync: JQuery;
  is_nosync: boolean;
  table_wrapper: JQuery;
  canvas_hover_dom: JQuery;
  canvas_on_dom: JQuery;
  canvas_off_dom: JQuery;
  canvas_hover: HTMLCanvasElement;
  canvas_on: HTMLCanvasElement;
  canvas_off: HTMLCanvasElement;
  ctx_hover: CanvasRenderingContext2D;
  ctx_on: CanvasRenderingContext2D;
  ctx_off: CanvasRenderingContext2D;
  cell: HTMLImageElement;
  cells_x: number;
  cells_y: number;
  btn_fold: JQuery;
  core: JQuery;
  is_panel_opened: boolean;
  btn_fx: JQuery;
  fx: JQuery;
  is_fx_view: boolean;
  keyboard: KeyboardView;
  pattern: SynthPattern;
  pattern_obj: SynthPatternObject;
  page: number;
  page_total: number;
  last_time: number;
  last_page: number;
  is_clicked: boolean;
  hover_pos: { x: number; y: number };
  click_pos: { x: number; y: number };
  rect: DOMRect;
  offset: { x: number; y: number };
  time: number;
  is_sustaining: boolean;
  sustain_l: number;
  sustain_r: number;
  is_adding: boolean;
  is_active: boolean;

  constructor(model: Synth, id: number) {
    this.model = model;
    this.id = id;
    this.dom = $('#tmpl_synth').clone();
    this.dom.attr('id', 'synth' + this.id);
    $('#instruments').append(this.dom);

    this.synth_name = this.dom.find('.synth-name');
    this.synth_name.val(this.model.name);
    this.pattern_name = this.dom.find('.pattern-name');
    this.pattern_name.val(this.model.pattern_name);

    // header DOM
    this.synth_type = this.dom.find('.synth-type');
    this.pencil = this.dom.find('.sequencer-pencil');
    this.step = this.dom.find('.sequencer-step');
    this.is_step = false;

    this.header = this.dom.find('.header');
    this.markers = this.dom.find('.markers');
    this.pos_markers = this.dom.find('.marker'); // list of list of markers
    this.marker_prev = this.dom.find('.marker-prev');
    this.marker_next = this.dom.find('.marker-next');
    this.plus = this.dom.find('.pattern-plus');
    this.minus = this.dom.find('.pattern-minus');
    this.nosync = this.dom.find('.pattern-nosync');
    this.is_nosync = false;
    this.setMarker();

    // table DOM
    this.table_wrapper = this.dom.find('.sequencer-table');
    this.canvas_hover_dom = this.dom.find('.table-hover');
    this.canvas_on_dom = this.dom.find('.table-on');
    this.canvas_off_dom = this.dom.find('.table-off');

    this.canvas_hover = this.canvas_hover_dom[0] as HTMLCanvasElement;
    this.canvas_on = this.canvas_on_dom[0] as HTMLCanvasElement;
    this.canvas_off = this.canvas_off_dom[0] as HTMLCanvasElement;

    this.ctx_hover = this.canvas_hover.getContext('2d')!;
    this.ctx_on = this.canvas_on.getContext('2d')!;
    this.ctx_off = this.canvas_off.getContext('2d')!;

    this.cell = new Image();
    this.cell.src = '/img/sequencer_cell.png';
    this.cell.onload = () => this.initCanvas();

    this.cells_x = 32;
    this.cells_y = 20;

    this.btn_fold = this.dom.find('.btn-fold-core');
    this.core = this.dom.find('.synth-core');
    this.is_panel_opened = true;

    this.btn_fx = this.dom.find('.btn-fx-view');
    this.fx = this.dom.find('.synth-fx');
    this.is_fx_view = false;

    this.keyboard = new KeyboardView(this);

    // Flags / Params
    this.pattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ];
    this.pattern_obj = { name: this.model.pattern_name, pattern: this.pattern };
    this.page = 0;
    this.page_total = 1;

    this.last_time = 0;
    this.last_page = 0;

    this.is_clicked = false;
    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };

    this.initEvent();
  }

  initCanvas() {
    this.canvas_hover.width =
      this.canvas_on.width =
      this.canvas_off.width =
        832;
    this.canvas_hover.height =
      this.canvas_on.height =
      this.canvas_off.height =
        520;
    this.rect = this.canvas_off.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    for (
      let i = 0, end = this.cells_y, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      for (
        var j = 0, end1 = this.cells_x, asc1 = 0 <= end1;
        asc1 ? j < end1 : j > end1;
        asc1 ? j++ : j--
      ) {
        this.ctx_off.drawImage(
          this.cell,
          0,
          0,
          26,
          26, // src (x, y, w, h)
          j * 26,
          i * 26,
          26,
          26 // dst (x, y, w, h)
        );
      }
    }
    return this.setPattern(this.pattern_obj);
  }

  getPos(e) {
    this.rect = this.canvas_off.getBoundingClientRect();
    const _x = Math.floor((e.clientX - this.rect.left) / 26);
    const _y = Math.floor((e.clientY - this.rect.top) / 26);
    return {
      x: _x,
      y: _y,
      x_abs: this.page * this.cells_x + _x,
      y_abs: _y,
      note: this.cells_y - _y,
    };
  }

  initEvent() {
    // Sequencer
    this.canvas_hover_dom
      .on('mousemove', (e) => {
        const pos = this.getPos(e);

        // Show current pos.
        if (pos !== this.hover_pos) {
          this.ctx_hover.clearRect(
            this.hover_pos.x * 26,
            this.hover_pos.y * 26,
            26,
            26
          );
          this.ctx_hover.drawImage(
            this.cell,
            52,
            0,
            26,
            26,
            pos.x * 26,
            pos.y * 26,
            26,
            26
          );
          this.hover_pos = pos;
        }

        // Add / Remove notes.
        if (this.is_clicked && this.click_pos !== pos) {
          if (this.is_sustaining) {
            this.sustain_l = Math.min(pos.x_abs, this.sustain_l);
            this.sustain_r = Math.max(pos.x_abs, this.sustain_r);
            this.sustainNote(this.sustain_l, this.sustain_r, pos);
          } else {
            if (this.is_adding) {
              this.addNote(pos);
            } else if (this.pattern[pos.x_abs] === pos.note) {
              this.removeNote(pos);
            }
          }
          return (this.click_pos = pos);
        }
      })
      .on('mousedown', (e) => {
        this.is_clicked = true;
        const pos = this.getPos(e);

        if (!this.is_step) {
          // sustaining
          if (
            this.pattern[pos.x_abs] === 'sustain' ||
            this.pattern[pos.x_abs] === 'end'
          ) {
            this.addNote(pos);
            this.sustain_l = this.sustain_r = pos.x_abs;
            return (this.is_sustaining = true);
            // not sustaining
          } else {
            this.addNote(pos);
            this.sustain_l = this.sustain_r = pos.x_abs;
            return (this.is_sustaining = true);
          }
        } else {
          if (this.pattern[pos.x_abs] === pos.note) {
            return this.removeNote(pos);
          } else {
            this.is_adding = true;
            return this.addNote(pos);
          }
        }
      })
      .on('mouseup', (e) => {
        this.is_clicked = false;
        if (!this.is_step) {
          const pos = this.getPos(e);
          return (this.is_sustaining = false);
        } else {
          return (this.is_adding = false);
        }
      })
      .on('mouseout', (e) => {
        this.ctx_hover.clearRect(
          this.hover_pos.x * 26,
          this.hover_pos.y * 26,
          26,
          26
        );
        this.hover_pos = { x: -1, y: -1 };
        this.is_clicked = false;
        return (this.is_adding = false);
      });

    // Headers
    this.synth_type.on('change', () =>
      this.model.changeSynth(this.synth_type.val())
    );
    this.synth_name
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput())
      .on('change', () => this.model.setSynthName(this.synth_name.val()));
    this.pattern_name
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput())
      .on('change', () => this.model.inputPatternName(this.pattern_name.val()));
    this.pencil.on('click', () => this.pencilMode());
    this.step.on('click', () => this.stepMode());

    this.marker_prev.on('click', () => this.model.player.backward(true));
    this.marker_next.on('click', () => this.model.player.forward());

    this.nosync.on('click', () => this.toggleNoSync());
    this.plus.on('click', () => this.plusPattern());
    this.minus.on('click', () => {
      if (this.pattern.length > this.cells_x) {
        return this.minusPattern();
      }
    });

    this.btn_fold.on('mousedown', () => {
      if (this.is_panel_opened) {
        this.core.css('height', '0px');
        this.table_wrapper.css('height', '524px');
        this.btn_fold
          .css({ top: '-22px', padding: '0px 5px 0px 0px' })
          .removeClass('fa-angle-down')
          .addClass('fa-angle-up');
        return (this.is_panel_opened = false);
      } else {
        this.core.css('height', '280px');
        this.table_wrapper.css('height', '262px');
        this.btn_fold
          .css({ top: '0px', padding: '5px 5px 5px 5px' })
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');
        return (this.is_panel_opened = true);
      }
    });

    return this.btn_fx.on('mousedown', () => {
      if (this.is_fx_view) {
        // @core.css('height', '0px')
        // @table_wrapper.css('height', '524px')
        // @btn_fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
        return (this.is_fx_view = false);
      } else {
        this.core.css('height', '280px');
        this.table_wrapper.css('height', '262px');
        this.btn_fold
          .css({ top: '0px', padding: '5px 5px 5px 5px' })
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');
        return (this.is_panel_opened = true);
      }
    });
  }

  addNote(pos: SynthPos) {
    let i, y;

    // ========================================
    // 1. Handle placing note inside existing sustained note
    //    → Truncate the sustain at previous position
    // ========================================
    if (
      this.pattern[pos.x_abs] === 'end' ||
      this.pattern[pos.x_abs] === 'sustain'
    ) {
      // Find the start of the sustained note (negative value)
      i = pos.x_abs - 1;
      while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
        i--;
      }

      // Clear the previous cell
      this.ctx_on.clearRect(((pos.x_abs - 1) % this.cells_x) * 26, 0, 26, 1000);
      // Calculate Y position from sustain start (negative, so add)
      // After the while loop, pattern[i] is guaranteed to be a number (sustain start)
      y = this.cells_y + (this.pattern[i] as number);

      const prevNote = this.pattern[pos.x_abs - 1];
      if (typeof prevNote === 'number' && prevNote < 0) {
        // Previous cell is sustain start → convert to regular note (flip sign)
        this.pattern[pos.x_abs - 1] = -prevNote;
        this.ctx_on.drawImage(
          this.cell,
          0,
          0,
          26,
          26,
          ((pos.x_abs - 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      } else {
        // Previous cell is 'sustain' → convert to 'end' to terminate
        this.pattern[pos.x_abs - 1] = 'end';
        this.ctx_on.drawImage(
          this.cell,
          156,
          0,
          26,
          26,
          ((pos.x_abs - 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      }
    }

    // ========================================
    // 2. Clear any sustain cells after current position
    // ========================================
    i = pos.x_abs + 1;
    while (this.pattern[i] === 'end' || this.pattern[i] === 'sustain') {
      this.pattern[i] = 0;
      i++;
    }
    this.ctx_on.clearRect(pos.x * 26, 0, (i - pos.x_abs) * 26, 1000);

    // ========================================
    // 3. Place the new note
    // ========================================
    this.pattern[pos.x_abs] = pos.note;
    this.model.addNote(pos.x_abs, pos.note);
    this.ctx_on.clearRect(pos.x * 26, 0, 26, 1000);
    return this.ctx_on.drawImage(
      this.cell,
      26,
      0,
      26,
      26,
      pos.x * 26,
      pos.y * 26,
      26,
      26
    );
  }

  removeNote(pos) {
    this.pattern[pos.x_abs] = 0;
    this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
    return this.model.removeNote(pos.x_abs);
  }

  sustainNote(l, r, pos) {
    let i, y;
    let asc, end;
    let asc1, end1, start;
    if (l === r) {
      this.addNote(pos);
      return;
    }

    for (
      i = l, end = r, asc = l <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      this.ctx_on.clearRect((i % this.cells_x) * 26, 0, 26, 1000);
    }

    for (
      start = l + 1, i = start, end1 = r, asc1 = start <= end1;
      asc1 ? i < end1 : i > end1;
      asc1 ? i++ : i--
    ) {
      this.pattern[i] = 'sustain';
      this.ctx_on.drawImage(
        this.cell,
        130,
        0,
        26,
        26,
        (i % this.cells_x) * 26,
        pos.y * 26,
        26,
        26
      );
    }

    if (this.pattern[l] === 'sustain' || this.pattern[l] === 'end') {
      i = l - 1;
      while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
        i--;
      }
      this.ctx_on.clearRect(((l - 1) % this.cells_x) * 26, 0, 26, 1000);
      y = this.cells_y + (this.pattern[i] as number);
      const prevNoteL = this.pattern[l - 1];
      if (typeof prevNoteL === 'number' && prevNoteL < 0) {
        this.pattern[l - 1] = -prevNoteL;
        this.ctx_on.drawImage(
          this.cell,
          0,
          0,
          26,
          26,
          ((l - 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      } else {
        this.pattern[l - 1] = 'end';
        this.ctx_on.drawImage(
          this.cell,
          156,
          0,
          26,
          26,
          ((l - 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      }
    }

    const noteR = this.pattern[r];
    if (typeof noteR === 'number' && noteR < 0) {
      y = this.cells_y + noteR;
      if (this.pattern[r + 1] === 'end') {
        this.pattern[r + 1] = -noteR;
        this.ctx_on.drawImage(
          this.cell,
          26,
          0,
          26,
          26,
          ((r + 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      } else {
        this.pattern[r + 1] = noteR;
        this.ctx_on.drawImage(
          this.cell,
          104,
          0,
          26,
          26,
          ((r + 1) % this.cells_x) * 26,
          y * 26,
          26,
          26
        );
      }
    }

    this.pattern[l] = -pos.note;
    this.pattern[r] = 'end';

    this.ctx_on.drawImage(
      this.cell,
      104,
      0,
      26,
      26,
      (l % this.cells_x) * 26,
      pos.y * 26,
      26,
      26
    );
    this.ctx_on.drawImage(
      this.cell,
      156,
      0,
      26,
      26,
      (r % this.cells_x) * 26,
      pos.y * 26,
      26,
      26
    );
    return this.model.sustainNote(l, r, pos.note);
  }

  endSustain(time?: number) {
    if (this.is_sustaining && time != null) {
      const note = this.pattern[time - 1];
      if (note === 'sustain') {
        this.pattern[time - 1] = 'end';
      } else if (typeof note === 'number') {
        this.pattern[time - 1] = note * -1;
      }
      return (this.is_sustaining = false);
    }
  }

  // Show the position bar.
  playAt(time) {
    this.time = time;
    if (this.is_nosync) {
      return;
    }

    if (this.time % this.cells_x === 0) {
      this.endSustain();
      this.drawPattern(this.time);
    }
    for (
      let i = 0, end = this.cells_y, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.ctx_off.drawImage(
        this.cell,
        0,
        0,
        26,
        26,
        (this.last_time % this.cells_x) * 26,
        i * 26,
        26,
        26
      );
      this.ctx_off.drawImage(
        this.cell,
        78,
        0,
        26,
        26,
        (this.time % this.cells_x) * 26,
        i * 26,
        26,
        26
      );
    }
    return (this.last_time = this.time);
  }

  setPattern(pattern_obj) {
    this.pattern_obj = pattern_obj;
    this.pattern = this.pattern_obj.pattern;
    this.page = 0;
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern(0);
    this.setMarker();
    return this.setPatternName(this.pattern_obj.name);
  }

  drawPattern(time?: number) {
    if (time != null) {
      this.time = time;
    }
    this.page = Math.floor(this.time / this.cells_x);
    this.ctx_on.clearRect(0, 0, 832, 520);

    let last_y = 0;

    for (
      let i = 0, end = this.cells_x, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      var y;
      var note = this.pattern[this.page * this.cells_x + i];
      if (note === 'sustain') {
        this.ctx_on.drawImage(
          this.cell,
          130,
          0,
          26,
          26,
          i * 26,
          last_y * 26,
          26,
          26
        );
      } else if (note === 'end') {
        this.ctx_on.drawImage(
          this.cell,
          156,
          0,
          26,
          26,
          i * 26,
          last_y * 26,
          26,
          26
        );
        last_y = 0;
      } else if (note < 0) {
        y = this.cells_y + note; // @cells_y - (- note)
        this.ctx_on.drawImage(
          this.cell,
          104,
          0,
          26,
          26,
          i * 26,
          y * 26,
          26,
          26
        );
        last_y = y;
      } else {
        y = this.cells_y - note;
        this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, i * 26, y * 26, 26, 26);
        last_y = y;
      }
    }
    return this.setMarker();
  }

  plusPattern() {
    if (this.page_total === 8) {
      return;
    }
    this.pattern = this.pattern.concat([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]);
    this.page_total++;
    this.model.plusPattern();
    this.drawPattern();
    this.minus.removeClass('btn-false').addClass('btn-true');
    if (this.page_total === 8) {
      return this.plus.removeClass('btn-true').addClass('btn-false');
    }
  }

  minusPattern() {
    if (this.page_total === 1) {
      return;
    }
    this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
    this.page_total--;
    this.model.minusPattern();
    this.drawPattern();
    this.plus.removeClass('btn-false').addClass('btn-true');
    if (this.page_total === 1) {
      return this.minus.removeClass('btn-true').addClass('btn-false');
    }
  }

  setMarker() {
    this.pos_markers
      .filter((i) => i < this.page_total)
      .addClass('marker-active');
    this.pos_markers
      .filter((i) => this.page_total <= i)
      .removeClass('marker-active');
    this.pos_markers
      .removeClass('marker-now')
      .eq(this.page)
      .addClass('marker-now');
    this.markers.find('.marker-pos').text(this.page + 1);
    this.markers.find('.marker-total').text(this.page_total);
    return this.pos_markers
      .filter((i: number) => i < this.page_total)
      .each((i: number) => {
        this.pos_markers.eq(i).on('mousedown', () => {
          if (this.page < i) {
            while (this.page !== i) {
              this.model.player.forward();
            }
          }
          if (i < this.page) {
            return (() => {
              const result = [];
              while (this.page !== i) {
                result.push(this.model.player.backward(true));
              }
              return result;
            })();
          } // force
        });
      });
  }

  play() {}
  stop() {
    return __range__(0, this.cells_y, false).map((i) =>
      this.ctx_off.drawImage(
        this.cell,
        0,
        0,
        26,
        26,
        (this.last_time % this.cells_x) * 26,
        i * 26,
        26,
        26
      )
    );
  }

  activate(i) {
    this.is_active = true;
    return this.initCanvas();
  }

  inactivate() {
    return (this.is_active = false);
  }

  setSynthName(name) {
    return this.synth_name.val(name);
  }
  setPatternName(name) {
    this.pattern_name.val(name);
    return (this.pattern_obj.name = name);
  }

  toggleNoSync() {
    if (this.is_nosync) {
      this.is_nosync = false;
      this.nosync.removeClass('btn-true').addClass('btn-false');
      return this.drawPattern(this.time);
    } else {
      this.is_nosync = true;
      this.nosync.removeClass('btn-false').addClass('btn-true');
      return __range__(0, this.cells_y, false).map((i) =>
        this.ctx_off.drawImage(
          this.cell,
          0,
          0,
          26,
          26,
          (this.time % this.cells_x) * 26,
          i * 26,
          26,
          26
        )
      );
    }
  }

  pencilMode() {
    this.is_step = false;
    this.pencil.removeClass('btn-false').addClass('btn-true');
    return this.step.removeClass('btn-true').addClass('btn-false');
  }

  stepMode() {
    this.is_step = true;
    this.step.removeClass('btn-false').addClass('btn-true');
    return this.pencil.removeClass('btn-true').addClass('btn-false');
  }

  changeScale(scale) {
    return this.keyboard.changeScale(scale);
  }
}

export { SynthView };

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
